import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
	return (
		<section className="py-24 px-4 lg:px-8 bg-gray-100">
			<div className="container mx-auto max-w-5xl">
				<div className="text-center">
					<h2 className="text-4xl md:text-5xl text-black font-normal mb-16 leading-tight">
						MudaMuse was created to inspire you to be the best version of yourself. Our goal is to bring you clothes that blanket you in quality, design, and comfort.
					</h2>
				</div>
				<div className="grid md:grid-cols-2 gap-16 text-gray-500">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra morbi cras augue egestas dictum habitasse. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra morbi cras augue egestas dictum habitasse.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra morbi cras augue egestas dictum habitasse. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra morbi cras augue egestas dictum habitasse.
					</p>
				</div>
				<div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
					<Button 
						className="group bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
					>
						Get started free
						<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</Button>
					<a
						href="/how-it-works"
						className="px-8 py-6 text-lg font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 transition-all text-black"
					>
						See how it works
					</a>
				</div>
			</div>
		</section>
	)
}

