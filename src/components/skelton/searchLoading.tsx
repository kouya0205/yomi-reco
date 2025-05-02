export default function SearchLoading() {
  return (
    <div className="flex items-center justify-center h-screen" role="status">
      <div className="relative w-48 h-64 perspective-500">
        {/* 本の表紙 */}
        <div className="absolute inset-0 bg-primary rounded-r-md shadow-lg z-10"></div>

        {/* ページのアニメーション */}
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-white rounded-r-md page-flip-animation"
            style={{
              animationDelay: `${index * 0.3}s`,
              transformOrigin: 'left center',
              zIndex: 5 - index,
            }}></div>
        ))}

        <span className="sr-only">検索中...</span>
      </div>

      {/* CSSアニメーション */}
      <style jsx>{`
        .perspective-500 {
          perspective: 500px;
        }

        .page-flip-animation {
          animation: pageFlip 1.5s ease-in-out infinite;
          box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
        }

        @keyframes pageFlip {
          0% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          50% {
            transform: rotateY(-180deg);
            opacity: 0.8;
          }
          100% {
            transform: rotateY(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
