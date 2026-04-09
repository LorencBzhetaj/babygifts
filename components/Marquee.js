export default function Marquee() {
  const items = [
    'Dhurata për Bebë',
    'Punime me Dorë 100%',
    'Personalizim me Emrin e Bebit',
    'Dorëzim Tiranë 48h',
    'WhatsApp 0697 536 334',
    'Dhurata për Vajza & Djem',
    'Materiale Premium',
    'Shporta Artizanale',
    'Arushe Teddy & Veshje',
    'Kids Body & Socks',
  ];

  return (
    <div className="strip" role="marquee" aria-label="Informacione Baby Gifts">
      <div className="stripInner">
        {[...items, ...items].map((item, i) => (
          <span key={i} className={i % 2 !== 0 ? 'stripDot' : ''}>{i % 2 === 0 ? item : '✦'}</span>
        ))}
      </div>
    </div>
  );
}
