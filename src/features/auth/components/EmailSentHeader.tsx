export function EmailSentHeader({ title, description }: { title: string; description: string }) {
	return (
		<>
			<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef3fb] text-2xl">
				✉️
			</div>
			<h2 className="mt-4 text-[22px] font-bold text-[#1a1a1a]">{title}</h2>
			<p className="mt-2 text-[13px] font-medium text-[#6b6b6b]">{description}</p>
		</>
	);
}
