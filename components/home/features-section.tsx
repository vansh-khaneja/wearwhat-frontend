"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from "next/image"

const images = [
	"/heroimg.png",
	"/heroimg2.png",
	"/heroimg3.png",
	"/heroimg4.png",
]

export function FeaturesSection() {
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % images.length)
		}, 3000)
		return () => clearInterval(interval)
	}, [])

	return (
		<section className="py-8 px-4 lg:px-8 bg-gray-100">
			<div className="container mx-auto max-w-6xl">
				<motion.div
					className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch h-[500px]"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6 }}
				>
					<div className="bg-[#1A1A1A] p-6 lg:p-10 flex flex-col justify-center">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						</h2>
						<p className="text-base text-gray-300">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor netus mauris velit vulputate lectus aliquam. Faucibus posuere at euismod.
						</p>
					</div>
					<div className="h-[500px] overflow-hidden relative">
						{images.map((src, index) => (
							<div
								key={src}
								className="absolute inset-0 transition-opacity duration-700"
								style={{ opacity: currentIndex === index ? 1 : 0 }}
							>
								<Image
									src={src}
									alt={`Feature image ${index + 1}`}
									width={600}
									height={500}
									className="w-full h-full object-cover"
								/>
							</div>
						))}
						{/* Dots indicator */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
							{images.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentIndex(index)}
									className={`w-2 h-2 rounded-full transition-all ${
										currentIndex === index ? 'bg-white w-6' : 'bg-white/50'
									}`}
								/>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
