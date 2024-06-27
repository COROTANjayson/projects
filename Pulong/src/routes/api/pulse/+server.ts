// import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';
// import { Server } from 'socket.io';

// import { createServer } from 'http';
// process.on('warning', (e) => console.warn(e.stack));
// import { EventEmitter } from 'events';

// const myEmitter = new EventEmitter();

// function listener1() {
// 	console.log('Event happened!');
// }

// myEmitter.on('someEvent', listener1);

// const listeners = myEmitter.listeners('someEvent');
// const corsOrigins = [process.env.CLIENT_URL ?? 'http://localhost:5173', 'http://localhost:5173'];
// console.log(`cors origins: `, corsOrigins);

// const httpServer = createServer((req, res) => {
// 	// Define the routes
// 	if (req.method === 'GET' && req.url === '/') {
// 		res.writeHead(200, { 'Content-Type': 'text/plain' });
// 		res.end('Server is running ...');
// 	} else {
// 		// Handle 404 Not Found
// 		res.writeHead(404, { 'Content-Type': 'text/plain' });
// 		res.end('404 Not Found');
// 	}
// });
// const io = new Server(httpServer, {
// 	// transports: ['websocket'],
// 	cors: {
// 		origin: corsOrigins,
// 		methods: ['GET', 'POST'],
// 		credentials: true
// 	}
// });

// const PORT = process.env.PORT || 3001;
// httpServer.listen(PORT, async () => {
// 	console.log(`socket.io server is running on port ${PORT}`);
// 	// await streamIssue(io);
// 	io.sockets.emit("ping", 'hello');
// });
// async function streamIssue(io: Server) {
// 	const stream = await prisma.issue.subscribe();

// 	// Handle Prisma stream events
// 	for await (const event of stream) {
// 		console.log(`received event: `, event);

// 		if (event.action === 'create') {
// 			io.sockets.emit('issue_added', event);
// 		}
// 	}
// }

export const GET: RequestHandler = async ({ request }) => {
	try {
		// await streamIssue(io);

		return new Response(JSON.stringify({ success: true, message: 'hello' }));
	} catch (e) {
		return new Response(JSON.stringify({ success: false }));
	}
};
