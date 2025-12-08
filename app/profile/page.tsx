// 'use client'

// import Profile from '@/components/auth/profile'
// import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
// import { useAuthStore } from '@/lib/store/useAuthStore'
// import { useRouter } from 'next/navigation'
// import { useEffect } from 'react'

// export default function ProfilePage() {
// 	const { isAuthenticated, isLoading } = useAuthStore()
// 	const router = useRouter()

// 	useEffect(() => {
// 		if (!isLoading && !isAuthenticated) {
// 			router.push('/auth/login')
// 		}
// 	}, [isAuthenticated, isLoading, router])

// 	if (isLoading) {
// 		return (
// 			<div className='flex items-center justify-center min-h-[60vh]'>
// 				<div className='text-center'>
// 					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
// 					<p className='mt-4 text-gray-600'>
// 						<LoadingSpinner />
// 					</p>
// 				</div>
// 			</div>
// 		)
// 	}

// 	if (!isAuthenticated) {
// 		return null
// 	}

// 	return (
// 		<div className='container mx-auto py-8'>
// 			<Profile />
// 		</div>
// 	)
// }

function Profilepage() {
	return (
		<div className='m-24'>
			<p>
				Profilepage Lorem ipsum dolor, sit amet consectetur adipisicing elit.
				Minima quibusdam temporibus facilis, nam quasi nobis distinctio placeat
				reiciendis eligendi aut nemo culpa officia atque. Necessitatibus
				excepturi optio nulla labore repellat temporibus magnam amet, nobis
				asperiores, ab architecto nesciunt distinctio omnis adipisci. Blanditiis
				atque tenetur maiores. A ipsum impedit quidem doloribus vero blanditiis
				provident praesentium soluta quam corporis quod accusantium reiciendis,
				similique quae recusandae magnam exercitationem minima alias. Soluta,
				sapiente! Sapiente illum quod voluptates veniam deleniti! Corrupti
				perspiciatis minima optio dolorum tempora deserunt ratione earum qui,
				voluptatibus fuga magnam quam sunt obcaecati necessitatibus odit
				repudiandae odio veniam! Placeat porro quaerat commodi?
			</p>
		</div>
	)
}

export default Profilepage
