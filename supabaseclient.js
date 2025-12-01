
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	console.warn('Supabase client initialized without credentials. Check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const USER_ROLES = ['advisor', 'student']
export const DEFAULT_ROLE = 'student'

// Some accounts (e.g. 'faculty') should be treated as advisors for
// the purposes of UI routing and permission checks. Map those aliases
// here so the rest of the code can keep using the normalized roles.
const ROLE_ALIASES = {
	faculty: 'advisor',
	admin: 'advisor',
}

const normalizeRole = (role) => {
	if (!role || typeof role !== 'string') return DEFAULT_ROLE
	const key = role.toLowerCase()
	const mapped = ROLE_ALIASES[key] || key
	return USER_ROLES.includes(mapped) ? mapped : DEFAULT_ROLE
}

export const getCurrentRole = async () => {
	const {
		data: { session }
	} = await supabase.auth.getSession()
	const roleFromMetadata = session?.user?.app_metadata?.role
	return normalizeRole(roleFromMetadata)
}

export const signInWithRole = async ({ email, password, role }) => {
	const result = await supabase.auth.signInWithPassword({ email, password })
	if (result.error) return result

	const normalizedRole = normalizeRole(result.data?.user?.app_metadata?.role)
	if (role && normalizedRole !== role) {
		await supabase.auth.signOut()
		return {
			data: null,
			error: new Error(`Account is registered as ${normalizedRole}, but ${role} access was requested.`)
		}
	}

	return {
		...result,
		role: normalizedRole
	}
}

export const requireRole = async (role) => {
	const normalizedRole = normalizeRole(role)
	const currentRole = await getCurrentRole()
	if (currentRole !== normalizedRole) {
		throw new Error('Access denied: insufficient permissions')
	}
	return currentRole
}

export const signOut = () => supabase.auth.signOut()