'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'

interface DialogProps {
	open?: boolean
	onOpenChange?: (open: boolean) => void
	children: React.ReactNode
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
	return (
		<div
			className={cn(
				'fixed inset-0 z-50 flex items-center justify-center',
				!open && 'hidden'
			)}
		>
			{children}
		</div>
	)
}

const DialogContent: React.FC<{
	children: React.ReactNode
	className?: string
}> = ({ children, className }) => {
	return (
		<div
			className={cn(
				'bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4',
				className
			)}
		>
			{children}
		</div>
	)
}

const DialogHeader: React.FC<{
	children: React.ReactNode
	className?: string
}> = ({ children, className }) => {
	return (
		<div
			className={cn(
				'flex flex-col space-y-1.5 text-center sm:text-left',
				className
			)}
		>
			{children}
		</div>
	)
}

const DialogTitle: React.FC<{
	children: React.ReactNode
	className?: string
}> = ({ children, className }) => {
	return (
		<h2
			className={cn(
				'text-lg font-semibold leading-none tracking-tight',
				className
			)}
		>
			{children}
		</h2>
	)
}

export { Dialog, DialogContent, DialogHeader, DialogTitle }
