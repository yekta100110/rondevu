export function BrandLogo({ placement = "header" }: { placement?: "header" | "footer" }) {
  return (
    <img
      src="/rondevu-logo-white.svg"
      alt="rOndevu"
      width={placement === "footer" ? 224 : 184}
      height={placement === "footer" ? 46 : 38}
      style={{
        display: "block",
        width: placement === "footer" ? "clamp(192px, 20vw, 224px)" : "clamp(136px, 15vw, 184px)",
        height: "auto",
        maxWidth: "none",
        mixBlendMode: "difference",
      }}
    />
  );
}
