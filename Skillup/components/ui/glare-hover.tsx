import './glare-hover.css';

interface GlareHoverProps {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  children: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const GlareHover = ({
  width = '100%',
  height = '100%',
  background = 'transparent',
  borderRadius = '1rem',
  borderColor = 'transparent',
  children,
  glareColor = 'rgba(164, 195, 178, 0.4)',
  glareOpacity = 0.6,
  glareAngle = -45,
  glareSize = 150,
  transitionDuration = 800,
  playOnce = false,
  className = '',
  style = {}
}: GlareHoverProps) => {
  return (
    <div
      className={`glare-hover ${playOnce ? 'glare-hover--play-once' : ''} ${className}`}
      style={{
        width,
        height,
        background,
        '--gh-br': borderRadius,
        '--gh-angle': `${glareAngle}deg`,
        '--gh-duration': `${transitionDuration}ms`,
        '--gh-size': `${glareSize}%`,
        '--gh-rgba': glareColor,
        '--gh-border': borderColor,
        ...style
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default GlareHover;
