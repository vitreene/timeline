import { expect, test } from 'vitest';
import { setup, $fetch } from 'vite-test-utils';

await setup({
	server: true,
});

test('create a capusle', async () => {
	const form = new FormData();
	form.append('type', 'img');
	form.append('sceneId', '1');
	// make a request to server from testing side using a helper API like fetch API
	const data = await $fetch('/capsule', {
		method: 'POST',
		body: form,
		headers: {
			accept: 'application/json',
		},
	});

	console.log(form);

	// expect(todo).toHaveProperty('uid')
	// expect(todo).toHaveProperty('created_at')
	// expect(todo).toContain({ text: 'task1', done: false })
});
