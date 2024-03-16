import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const scene: Prisma.SceneCreateInput = {};

const capsules = (id: number): Prisma.CapsuleCreateInput[] => [
	{
		type: 'background',
		scene: { connect: { id } },
	},
	{
		type: 'list',
		scene: { connect: { id } },
	},
];

const medias: Prisma.MediaCreateInput[] = [
	{
		type: 'img',
		path: 'assets/28970388742_2f75d527d6_z.jpg',
	},
	{
		type: 'img',
		path: 'assets/28999069391_5893263112_z.jpg',
	},
];

const capsuleElements = (
	capsuleId: number,
	media1Id: number,
	media2Id: number
): Prisma.CapsuleElementCreateInput[] => [
	{
		order: 1,
		media: { connect: { id: media1Id } },
		capsule: { connect: { id: capsuleId } },
	},
	{
		order: 2,
		media: { connect: { id: media2Id } },
		capsule: { connect: { id: capsuleId } },
	},
];

interface PCapsule {
	id: number;
	type: string;
	sceneId: number;
}
interface PMedia {
	id: number;
	type: string;
	path: string | null;
	content: string | null;
}

interface PCapsuleElement {
	id: number;
	order: number;
	mediaId: number;
	capsuleId: number;
}

async function main() {
	console.log(`Start seeding ...`);

	const newScene = await prisma.scene.create({ data: scene });

	const newMedias: PMedia[] = [];
	for (const m of medias) {
		const nm = await prisma.media.create({ data: m });
		newMedias.push(nm);
	}

	const newCapsules: PCapsule[] = [];
	for (const c of capsules(newScene.id)) {
		const nc = await prisma.capsule.create({ data: c });
		newCapsules.push(nc);
	}
	const newCapsuleElements: PCapsuleElement[] = [];
	for (const ce of capsuleElements(newCapsules[0].id, newMedias[0].id, newMedias[1].id)) {
		const nce = await prisma.capsuleElement.create({ data: ce });
		newCapsuleElements.push(nce);
	}

	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
