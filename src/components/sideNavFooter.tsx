import Link from 'next/link';

type SideNavItem = {
  href: string;
  title: string;
};

export default function SideNavFooter() {
  const sideNavFooterItems: SideNavItem[] = [
    { href: '/datasource', title: 'データソース' },
    { href: 'https://github.com/kouya0205/yomi-reco', title: 'GitHub' },
    { href: '/terms', title: '利用規約' },
    { href: '/privacy', title: 'プライバシーポリシー' },
  ];
  return (
    <footer className="flex flex-col gap-1 justify-center pl-6">
      {sideNavFooterItems.map(({ href, title }) => (
        <Link
          target="_blank"
          key={href}
          href={href}
          className="text-xs text-[#bd7328] hover:underline">
          {title}
        </Link>
      ))}
      <p className="text-xs">&copy; 2025 yomireco</p>
    </footer>
  );
}
