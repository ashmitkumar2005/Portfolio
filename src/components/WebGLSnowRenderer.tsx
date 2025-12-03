"use client";

import React, { useEffect, useRef } from "react";
import type { SnowPileFooterProps } from "../types";

type WebGLSnowRendererProps = {
  heightfield: Float32Array;
  widthPx: number;
  heightPx: number;
  colors: SnowPileFooterProps["colors"];
  mouseUv?: { x: number; y: number } | null;
};

const WebGLSnowRenderer: React.FC<WebGLSnowRendererProps> = ({
  heightfield,
  widthPx,
  heightPx,
  colors,
  mouseUv,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    mouseRef.current = mouseUv ?? null;
  }, [mouseUv]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { antialias: true, premultipliedAlpha: true }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, widthPx);
    const height = Math.max(1, heightPx);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_heightTex;
      uniform float u_widthCells;
      uniform float u_pileHeight;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_hasMouse;

      float sampleHeight(float x) {
        float u = clamp(x, 0.0, 0.9999);
        return texture2D(u_heightTex, vec2(u, 0.5)).r;
      }

      // Simple hash-based noise
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 345.45));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * hash(p);
          p *= 2.3;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        // x in [0,1] across width, y in [0,1] bottom->top
        float ux = v_uv.x;
        float uy = v_uv.y;

        // Heightfield sample positions
        float cells = max(u_widthCells, 1.0);
        float idx = ux * (cells - 1.0);
        float fx = idx / (cells - 1.0);

        float hL = sampleHeight((idx - 1.0) / (cells - 1.0));
        float hC = sampleHeight(idx / (cells - 1.0));
        float hR = sampleHeight((idx + 1.0) / (cells - 1.0));

        // --- Shape enhancement: multi-frequency fBM bumps on top of heightfield
        float xC = ux;
        float xL = ux - (1.0 / max(cells, 2.0));
        float xR = ux + (1.0 / max(cells, 2.0));

        // Simplified bump mapping: single FBM call per sample point instead of 3
        float nC = fbm(vec2(xC * 2.0, 1.37));
        float bumpC = nC * 1.5;

        float nL = fbm(vec2(xL * 2.0, 1.37));
        float bumpL = nL * 1.5;

        float nR = fbm(vec2(xR * 2.0, 1.37));
        float bumpR = nR * 1.5;

        float heightScale = 0.1;
        float hL_final = (hL + bumpL * 0.02) * heightScale;
        float hC_final = (hC + bumpC * 0.02) * heightScale;
        float hR_final = (hR + bumpR * 0.02) * heightScale;

        // Map final height to vertical UV 0..1 (0 bottom,1 top)
        float pile = u_pileHeight;
        float snowY = pile * hC_final; // fraction of screen height used by pile

        // Cursor influence: slight bulge where the cursor is near the crest
        float cursorK = 0.0;
        if (u_hasMouse > 0.5) {
          float dx = ux - u_mouse.x;
          float dy = uy - u_mouse.y;
          float dist = sqrt(dx * dx + dy * dy);
          float radius = 0.22;       // tighter radial area
          float k = max(0.0, 1.0 - dist / radius);

          // Emphasize pixels very close to the cursor
          cursorK = pow(k, 2.0);
          snowY += cursorK * 0.05;   // slightly stronger local bulge
        }

        // Discard pixels above the pile surface, with slight noisy edge
        float edgeN = fbm(vec2(ux * 6.0, 3.1));
        float edge = snowY + (edgeN - 0.5) * 0.035;
        if (uy > edge) {
          discard;
        }

        // Derivatives for normal
        float dhdx = (hR_final - hL_final) * 0.5;
        float dhdy = 0.15; // gentle slope inward

        vec3 n = normalize(vec3(-dhdx, 1.0, dhdy));
        vec3 lightDir = normalize(vec3(0.3, 0.9, 0.4));

        float diffuse = max(dot(n, lightDir), 0.0);
        float rim = pow(1.0 - dot(n, vec3(0.0, 1.0, 0.0)), 2.5);

        // Cold snow palette (no warm tint)
        vec3 baseColor     = vec3(0.90, 0.95, 1.00);
        vec3 shadowTint    = vec3(0.65, 0.78, 0.95);
        vec3 highlightTint = vec3(0.97, 1.00, 1.00);
        vec3 rimColor      = vec3(0.85, 0.95, 1.0);

        // Core shading
        vec3 finalColor = mix(shadowTint, highlightTint, diffuse);
        rim *= 0.25;
        finalColor += rim * rimColor;
        finalColor = mix(finalColor, baseColor, 0.25);

        // Neutral/cool micro-noise modulation (no warm bias)
        float nNoise = fbm(v_uv * vec2(18.0, 6.0));
        finalColor *= 0.92 + nNoise * 0.10;

        // Boost icy highlights for strong peaks (moonlight effect)
        if (diffuse > 0.65) {
          finalColor = min(finalColor * 1.08, vec3(1.0));
        }

        // Micro sparkle / ice crystals near the crest
        // Deterministic distribution via hash, twinkle via time-based modulation
        float crestBand = smoothstep(edge - 0.06, edge, uy) * (1.0 - smoothstep(edge, edge + 0.05, uy));
        if (crestBand > 0.0) {
          vec2 sp = vec2(ux * 120.0, floor(uy * 40.0));
          float rnd = hash(sp);
          if (rnd > 0.9975) { // slightly higher density (~0.25%)
            float tw = 0.5 + 0.5 * sin(u_time * 2.5 + rnd * 50.0);
            float sparkle = 1.1 + 0.15 * tw;
            vec3 sparkleColor = vec3(0.97, 1.0, 1.0);
            finalColor = mix(finalColor, sparkleColor, 0.55 * sparkle);
          }
        }

        // Subtle bluish outer glow just above the snow edge
        float edgeDist = clamp(edge - uy, 0.0, 0.05) / 0.05; // 0 at edge,1 a bit below (thicker band)
        float glowFactor = pow(edgeDist, 1.4);
        vec3 glowColor = vec3(0.705, 0.823, 1.0); // 180,210,255 approx
        finalColor = mix(finalColor, glowColor, glowFactor * 0.22);

        // Cursor highlight: strong radial recolor and brightness around cursor
        if (u_hasMouse > 0.5 && cursorK > 0.0) {
          float glowStrength = cursorK;

          // Cursor tint (soft blue-white similar to custom cursor)
          vec3 cursorColor = vec3(0.45, 0.78, 1.0);

          // Push color strongly toward cursor tint
          vec3 tinted = mix(finalColor, cursorColor, glowStrength * 1.1);
          // Boost brightness so the effect is clearly visible
          finalColor = mix(tinted, vec3(1.0), glowStrength * 0.7);
        }

        // Soft darkening toward bottom for contact shadow (acts like wide, deep blur)
        float yNorm = uy;
        float shadowFalloff = smoothstep(0.0, 0.35, yNorm);
        finalColor *= mix(0.55, 1.0, shadowFalloff);

        float alpha = 0.96;
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    function compileShader(glCtx: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Quad covering clipspace [-1,1]^2
    const positionLoc = gl.getAttribLocation(program, "a_position");
    const quad = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Upload heightfield as 1D texture (encoded in RGBA8)
    const cells = heightfield.length;
    const texData = new Uint8Array(cells * 4);
    let maxH = 0;
    for (let i = 0; i < cells; i++) maxH = Math.max(maxH, heightfield[i]);
    const inv = maxH > 0 ? 1 / maxH : 0;
    for (let i = 0; i < cells; i++) {
      const h = heightfield[i] * inv;
      const v = Math.max(0, Math.min(255, Math.round(h * 255)));
      const o = i * 4;
      texData[o] = v;
      texData[o + 1] = v;
      texData[o + 2] = v;
      texData[o + 3] = 255;
    }

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      cells,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      texData,
    );

    const uHeightTex = gl.getUniformLocation(program, "u_heightTex");
    const uWidthCells = gl.getUniformLocation(program, "u_widthCells");
    const uPileHeight = gl.getUniformLocation(program, "u_pileHeight");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uHasMouse = gl.getUniformLocation(program, "u_hasMouse");

    gl.uniform1i(uHeightTex, 0);
    gl.uniform1f(uWidthCells, cells);
    gl.uniform1f(uPileHeight, 0.8);
    gl.uniform2f(uResolution, width, height);

    gl.clearColor(0, 0, 0, 0);

    let frameId: number;
    const render = (timeMs: number) => {
      const t = timeMs * 0.001;
      if (uTime) gl.uniform1f(uTime, t);
      if (uMouse && uHasMouse) {
        const m = mouseRef.current;
        if (m) {
          gl.uniform2f(uMouse, m.x, m.y);
          gl.uniform1f(uHasMouse, 1.0);
        } else {
          gl.uniform1f(uHasMouse, 0.0);
        }
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameId = requestAnimationFrame(render);
    };
    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      gl.deleteTexture(tex);
      gl.deleteBuffer(vbo);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [heightfield, widthPx, heightPx, colors]);

  return <canvas ref={canvasRef} className="snowpile-canvas" />;
};

export default WebGLSnowRenderer;
