const CircleOfFifths = ({ onKeySelect }) => {
  const keys = [
    { name: "C Major", position: 0, sharps: 0 },
    { name: "G Major", position: 1, sharps: 1 },
    { name: "D Major", position: 2, sharps: 2 },
    { name: "A Major", position: 3, sharps: 3 },
    { name: "E Major", position: 4, sharps: 4 },
    { name: "B Major", position: 5, sharps: 5 },
    { name: "F# Major", position: 6, sharps: 6 },
    { name: "Db Major", position: 7, sharps: -5 },
    { name: "Ab Major", position: 8, sharps: -4 },
    { name: "Eb Major", position: 9, sharps: -3 },
    { name: "Bb Major", position: 10, sharps: -2 },
    { name: "F Major", position: 11, sharps: -1 },
  ];

  const radius = 100; // Radio del círculo
  const centerX = 150; // Coordenada X del centro
  const centerY = 150; // Coordenada Y del centro

  return (
    <svg viewBox="0 0 300 300" className="circle-of-fifths">
      {keys.map((key, index) => {
        const angle = (index / keys.length) * 2 * Math.PI; // Ángulo en radianes
        const cx = centerX + Math.cos(angle) * radius;
        const cy = centerY + Math.sin(angle) * radius;

        return (
          <g key={index} onClick={() => onKeySelect(key.name)}>
            <circle
              cx={cx}
              cy={cy}
              r={20}
              className="key-circle"
              fill="black"
            />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              style={{ fontSize: "10px" }}
            >
              {key.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default CircleOfFifths;
