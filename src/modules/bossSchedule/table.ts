import { BossWithCron, CronExpression } from '../../types.js';

export const table: BossWithCron[] = [
	{
		name: 'Продажный правитель Кзарка',
		shortName: 'Кзарка',
		cronExpressions: [
			'0 1 * * 0',
			'0 18 * * 0',
			'0 0 * * 1',
			'0 0 * * 2',
			'0 14 * * 2',
			'0 18 * * 3',
			'0 18 * * 4',
			'0 1 * * 5',
			'0 18 * * 5',
			'0 0 * * 6',
			'0 8 * * 6',
		],
	},
	{
		name: 'Каранда',
		shortName: 'Каранда',
		cronExpressions: [
			'0 8 * * 0',
			'0 0 * * 1',
			'0 16 * * 1',
			'0 23 * * 1',
			'0 1 * * 2',
			'0 12 * * 2',
			'0 18 * * 2',
			'0 14 * * 3',
			'0 0 * * 4',
			'0 12 * * 5',
			'0 16 * * 6',
		],
	},
	{
		name: 'Нубэр',
		shortName: 'Нубэр',
		cronExpressions: [
			'0 18 * * 0',
			'0 1 * * 1',
			'0 14 * * 1',
			'0 23 * * 1',
			'0 1 * * 3',
			'0 16 * * 3',
			'0 12 * * 4',
			'0 16 * * 4',
			'0 0 * * 5',
			'0 16 * * 5',
			'0 0 * * 6',
			'0 10 * * 6',
		],
	},
	{
		name: 'Древний Кутум',
		shortName: 'Кутум',
		cronExpressions: [
			'0 10 * * 0',
			'0 14 * * 0',
			'0 12 * * 1',
			'0 18 * * 1',
			'0 16 * * 2',
			'0 0 * * 3',
			'0 1 * * 4',
			'0 14 * * 4',
			'0 14 * * 5',
			'0 1 * * 6',
			'0 12 * * 6',
			'0 18 * * 6',
		],
	},
	{
		name: 'Мурака',
		shortName: 'Мурака',
		cronExpressions: ['0 23 * * 2', '0 14 * * 6'],
	},
	{
		name: 'Квинт',
		shortName: 'Квинт',
		cronExpressions: ['0 23 * * 2', '0 14 * * 6'],
	},
	// {
	// 	name: 'Камос',
	// 	shortName: 'Камос',
	// 	cronExpressions: [
	// 		'0 13 * * 0',
	// 		'0 13 * * 1',
	// 		'0 13 * * 2',
	// 		'0 13 * * 3',
	// 		'0 13 * * 4',
	// 		'0 13 * * 5',
	// 		'0 13 * * 6',
	// 		'15 22 * * 0',
	// 		'15 22 * * 1',
	// 		'15 22 * * 2',
	// 		'15 22 * * 3',
	// 		'15 22 * * 4',
	// 		'15 22 * * 5',
	// 		'0 0 * * 0',
	// 	],
	// },
	{
		name: 'Велл',
		shortName: 'Велл',
		cronExpressions: ['0 16 * * 0', '0 23 * * 3'],
	},
	{
		name: 'Офин-разрушитель',
		shortName: 'Офин',
		cronExpressions: ['0 23 * * 0', '0 18 * * 3', '0 23 * * 5'],
	},
	{
		name: 'Детеныш Велл',
		shortName: 'Детеныш Велл',
		cronExpressions: Array.from({ length: 7 }, (_, day: number) => {
			const dailySpawns = ['0:30', '12:30', '15:30', '17:30', '23:30'];
			const crons: CronExpression[] = [];
			for (const time of dailySpawns) {
				const [hour, min] = time.split(':').map(s => Number(s));
				crons.push(`${min} ${hour} * * ${day}`);
			}

			return crons;
		}).flat(),
	},
];
