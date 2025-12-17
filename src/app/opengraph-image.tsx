import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Ashmit Kumar - Developer Portfolio";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(to bottom, #000000, #111111)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 40,
                    }}
                >
                    {/* Logo Circle */}
                    <div
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 60px rgba(59, 130, 246, 0.5)",
                        }}
                    >
                        <div
                            style={{
                                color: "white",
                                fontSize: 64,
                                fontWeight: "bold",
                            }}
                        >
                            A
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        color: "white",
                        fontSize: 84,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: 20,
                        textShadow: "0 0 40px rgba(255,255,255,0.3)",
                    }}
                >
                    Ashmit Kumar
                </div>

                <div
                    style={{
                        color: "#94a3b8",
                        fontSize: 42,
                        textAlign: "center",
                        maxWidth: 800,
                    }}
                >
                    Crafting intelligent, beautiful web experiences
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
