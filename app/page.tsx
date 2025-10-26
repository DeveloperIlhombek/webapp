import { redirect } from 'next/navigation'

export default function HomePage() {
	// foydalanuvchini to‘g‘ridan-to‘g‘ri /telegram sahifaga yo‘naltiramiz
	redirect('/telegram')
}
