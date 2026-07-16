interface Props {
  size?: number;
  className?: string;
}

export default function LogoMark({ size = 40, className = "" }: Props) {
  return (
    <img
      src="/logo.png"
      alt="Human Interaction"
      width={size}
      height={size}
      className={`rounded-xl object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
