const PREDIOS = [
  { x: 64,  y: 170, w: 72, h: 150, cor: '#2F6B45' },
  { x: 146, y: 116, w: 82, h: 204, cor: '#1F4A30' },
  { x: 238, y: 192, w: 64, h: 128, cor: '#3C7A96' },
  { x: 312, y: 150, w: 78, h: 170, cor: '#C4552B' },
]

const ARVORES = [
  { x: 36,  r: 24 },
  { x: 214, r: 18 },
  { x: 420, r: 28 },
]

function janelas({ x, y, w, h }) {
  const lista = []
  for (let jy = y + 16; jy < y + h - 22; jy += 24) {
    for (let jx = x + 12; jx < x + w - 14; jx += 20) {
      lista.push(<rect key={`${jx}-${jy}`} x={jx} y={jy} width="10" height="12" rx="2" fill="#F4EFE3" opacity="0.78" />)
    }
  }
  return lista
}

export default function CityIllustration({ className }) {
  return (
    <svg className={className} viewBox="0 0 480 420" role="img" aria-label="Ilustração de uma cidade com prédios, árvores e sol">
      <defs>
        <clipPath id="moldura"><rect width="480" height="420" rx="28" /></clipPath>
      </defs>
      <g clipPath="url(#moldura)">
        <rect width="480" height="420" fill="#E3ECD8" />
        <circle cx="372" cy="96" r="50" fill="#E2A93B" />
        <path d="M0 282 Q120 236 240 270 T480 258 V420 H0 Z" fill="#BBD3A9" />

        {PREDIOS.map(p => (
          <g key={p.x}>
            <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="6" fill={p.cor} />
            {janelas(p)}
          </g>
        ))}

        {/* Telhado verde no prédio mais alto */}
        <circle cx="166" cy="114" r="11" fill="#6FA35A" />
        <circle cx="188" cy="108" r="14" fill="#5C9149" />
        <circle cx="210" cy="114" r="10" fill="#6FA35A" />

        <rect y="318" width="480" height="102" fill="#94BC80" />
        <rect y="318" width="480" height="6" fill="#7FA96B" />

        {ARVORES.map(({ x, r }) => (
          <g key={x}>
            <rect x={x - 3} y={318 - r} width="6" height={r + 4} rx="2" fill="#5A4632" />
            <circle cx={x} cy={318 - r * 1.6} r={r} fill="#3E7D4E" />
          </g>
        ))}

        {/* Lixeiras de coleta seletiva */}
        {['#3C7A96', '#C4552B', '#2F6B45', '#E2A93B'].map((cor, i) => (
          <rect key={cor} x={262 + i * 22} y="336" width="16" height="22" rx="3" fill={cor} />
        ))}
      </g>
    </svg>
  )
}
