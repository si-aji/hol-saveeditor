"use client"

// Icons
import { Heart } from "lucide-react";

// Partials
import Body from "./(_partials)/body";

export default function Home() {
  return (
    <div className=" xl:container mx-auto pt-10 pb-4 px-4 h-dvh">
		<div className=" flex flex-col gap-6 justify-between h-full">
			<div className=" flex flex-col gap-10 items-center">
				{/* Heading */}
				<div className=" flex flex-col gap-2 items-center">
					<h1 className=" text-2xl font-bold leading-none">House of Legacy</h1>
					<span className=" text-lg font-semibold leading-none">EasySave Editor</span>
				</div>

				{/* Body */}
				<Body/>
			</div>

			{/* Footer */}
			<footer className=" flex flex-col lg:flex-row flex-wrap gap-1 lg:gap-4 justify-between items-center pb-4">
				<span className=" flex flex-row items-center gap-1">Made with <Heart/> at {new Date().getFullYear()}</span>
				
				<div className=" flex flex-row gap-2">
					<span>Terms of Service</span>
					<span>|</span>
					<span>Privacy Policy</span>
					<span>|</span>
					<span>Credits</span>
				</div>
			</footer>
		</div>
    </div>
  );
}
