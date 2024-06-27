<script>
	import { enhance } from '$app/forms';
</script>

<div class="bg-error-100 text-surface-500 px-4 py-3 rounded relative w-auto" role="alert">
	<span class="block sm:inline"
		>Your email has not been verified yet. Please verify your email to unlock all the features.
	</span>
	<form method="post" action="?/resendVerificationEmail" use:enhance>
		<button class="btn variant-ghost-primary">Resend Verification Email</button>
	</form>
</div>
