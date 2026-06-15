// Подвал сайта: создатель и автор идеи.
export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-sm text-slate-500 sm:flex-row">
        <p>
          Создатель:{' '}
          <a
            href="https://github.com/yhashiki"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
          >
            yh&apos;ashiki
          </a>
        </p>
        <p>
          Автор идеи: <span className="font-medium text-slate-700">Ставицкий Сергей</span>
        </p>
      </div>
    </footer>
  )
}
