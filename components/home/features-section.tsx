"use client"
import React from "react"
import { motion } from 'framer-motion'
import Image from "next/image"

export function FeaturesSection() {
	return (
		<section className="py-20 px-4 lg:px-8 bg-gray-100">
			<div className="container mx-auto max-w-7xl">
				<motion.div
					className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6 }}
				>
					<div className="bg-[#1A1A1A] p-8 lg:p-16 flex flex-col justify-center">
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						</h2>
						<p className="text-lg text-gray-300">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor netus mauris velit vulputate lectus aliquam. Faucibus posuere at euismod.
						</p>
					</div>
					<div>
						<Image
							src="/feature.jpg"
							alt="Feature image"
							width={600}
							height={600}
							className="w-full h-full object-cover"
						/>
					</div>
				</motion.div>
			</div>
		</section>
	)
}


