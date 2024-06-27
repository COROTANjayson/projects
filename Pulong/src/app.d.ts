// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { Session, User } from 'lucia';
// type User = {
// 	id: number;
// 	email: string;
// 	role: string;
// 	created_at: Date;
// 	updated_at: Date;
// }
declare global {
	declare namespace App {
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}
