import Link from 'next/link';

export default function MenuItem({ item }: any) {
  return (
    <Link href={item.path || '#'}>
      <div style={{
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '8px'
      }}>
        {item.label}
      </div>
    </Link>
  );
}
