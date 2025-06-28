// Plantillas parametrizadas de misiones
const ruleTemplates = [
	{ id: 1, kind: "suitsOnly", coins: 8, suits: ["oros", "bastos"] },
	{ id: 2, kind: "noConsecutive", coins: 6, suit: "bastos" },
	{ id: 3, kind: "sumGreater", coins: 5, suitA: "bastos", suitB: "espadas" },
	{ id: 4, kind: "sumExact", coins: 6, suit: "oros", sum: 8 },
	{ id: 5, kind: "countSuit", coins: 3, suit: "copas", count: 2 },
	{ id: 6, kind: "maxSuit", coins: 3, suit: "espadas" },
	{ id: 7, kind: "sumTotalGE", coins: 5, total: 20 },
	{ id: 8, kind: "allDifferent", coins: 8 },
	{ id: 9, kind: "hasPair", coins: 4 },
	{ id: 10, kind: "noNeighborSuit", coins: 6 },
	{
		id: 11,
		kind: "sumGroupsEqual",
		coins: 8,
		groupA: ["oros", "copas"],
		groupB: ["espadas", "bastos"]
	},
	{ id: 12, kind: "countOdd", coins: 4, count: 3 },
	{ id: 13, kind: "minSuit", coins: 3, suit: "copas" },
	{ id: 14, kind: "sumTotalEven", coins: 2 },
	{ id: 15, kind: "hasSequence", coins: 8, length: 3 },
	{ id: 16, kind: "maxLE", coins: 5, max: 7 },
	{ id: 17, kind: "allGT", coins: 5, min: 5 },
	{ id: 18, kind: "oneEachSuit", coins: 8 },
	{ id: 19, kind: "sumAtPos", coins: 6, positions: [1, 2], sum: 11 },
	{ id: 20, kind: "distinctSuitCount", coins: 3, count: 3 },
	{ id: 21, kind: "sumSuitMultiple", coins: 6, suit: "espadas", multiple: 3 },
	{ id: 22, kind: "countInList", coins: 3, values: [2, 3, 5, 7], minCount: 2 },
	{ id: 23, kind: "forbidAdjValues", coins: 5, valueA: 10, valueB: 9 },
	{ id: 24, kind: "sumSuitGE", coins: 6, suit: "copas", total: 12 },
	{ id: 25, kind: "maxSuitLE", coins: 5, suit: "oros", max: 4 },
	{ id: 26, kind: "sumPosImparGTPar", coins: 7 },
	{ id: 27, kind: "allDifferent", coins: 8 },
	{ id: 28, kind: "sumTotalExact", coins: 8, total: 25 },
	{ id: 29, kind: "hasValue", coins: 4, value: 1 },
	{ id: 30, kind: "allEven", coins: 8 },
	{ id: 31, kind: "suitAtPos", coins: 7, suit: "espadas", positions: [0, 3] },
	{ id: 32, kind: "exactConsecutiveCount", coins: 7, count: 1 },
	{ id: 33, kind: "minNotSuit", coins: 5, suit: "copas" },
	{ id: 34, kind: "sumSuitOdd", coins: 6, suit: "bastos" },
	{ id: 35, kind: "sumTotalLT", coins: 5, total: 18 },
	{ id: 36, kind: "valueBetweenNeighbors", coins: 8, value: 7 },
	{ id: 37, kind: "suitCountGreater", coins: 5, suitA: "oros", suitB: "copas" },
	{
		id: 38,
		kind: "hasSequenceExact",
		coins: 9,
		sequences: [
			[1, 2, 3, 4],
			[7, 8, 9, 10]
		]
	},
	{ id: 39, kind: "sumSuitExact", coins: 8, suit: "espadas", total: 15 },
	{ id: 40, kind: "minMaxSameSuit", coins: 9 },
	{ id: 41, kind: "maxSuitCount", coins: 4, maxCount: 2 },
	{ id: 42, kind: "diffMinMaxLE", coins: 5, diff: 5 },
	{ id: 43, kind: "suitAtEnds", coins: 5 },
	{ id: 44, kind: "sumPosParExact", coins: 6, sum: 10 },
	{ id: 45, kind: "hasTriangle", coins: 8 },
	{ id: 46, kind: "allSameParity", coins: 6 },
	{
		id: 47,
		kind: "sumGroupExact",
		coins: 8,
		group: ["oros", "espadas"],
		total: 14
	},
	{ id: 48, kind: "forbidValue", coins: 3, value: 10 },
	{ id: 49, kind: "twoPairs", coins: 6 },
	{
		id: 50,
		kind: "sumGroupExact",
		coins: 8,
		group: ["copas", "bastos"],
		total: 16
	}
];

// Generadores de texto y validadores
const generators = {
	suitsOnly: (t) => ({
		objective: `Que las cuatro cartas sean únicamente de ${t.suits.join(" o ")}.`,
		validate: (table) => table.every((c) => t.suits.includes(c.suit))
	}),
	noConsecutive: (t) => ({
		objective: `No puede haber dos cartas de ${t.suit} con valores consecutivos.`,
		validate: (table) => {
			const v = table
				.filter((c) => c.suit === t.suit)
				.map((c) => c.value)
				.sort((a, b) => a - b);
			return !v.some((x, i) => i > 0 && x - v[i - 1] === 1);
		}
	}),
	sumGreater: (t) => ({
		objective: `La suma de los valores de ${t.suitA} debe ser mayor que la de ${t.suitB}.`,
		validate: (table) => {
			const sum = (s) =>
				table.filter((c) => c.suit === s).reduce((a, c) => a + c.value, 0);
			return sum(t.suitA) > sum(t.suitB);
		}
	}),
	sumExact: (t) => ({
		objective: `La suma de los valores de ${t.suit} debe ser exactamente ${t.sum}.`,
		validate: (table) =>
			table.filter((c) => c.suit === t.suit).reduce((a, c) => a + c.value, 0) ===
			t.sum
	}),
	countSuit: (t) => ({
		objective: `Tener exactamente ${t.count} cartas de ${t.suit}.`,
		validate: (table) => table.filter((c) => c.suit === t.suit).length === t.count
	}),
	maxSuit: (t) => ({
		objective: `Que la carta de mayor valor sea de ${t.suit}.`,
		validate: (table) => {
			const m = Math.max(...table.map((c) => c.value));
			return table.some((c) => c.value === m && c.suit === t.suit);
		}
	}),
	sumTotalGE: (t) => ({
		objective: `La suma total de las cuatro cartas sea ≥ ${t.total}.`,
		validate: (table) => table.reduce((a, c) => a + c.value, 0) >= t.total
	}),
	allDifferent: (_) => ({
		objective: `Todas las cartas deben ser de palos distintos.`,
		validate: (table) => new Set(table.map((c) => c.suit)).size === 4
	}),
	hasPair: (_) => ({
		objective: `Que haya al menos una pareja (dos cartas del mismo valor).`,
		validate: (table) =>
			Object.values(
				table.reduce((m, c) => {
					m[c.value] = (m[c.value] || 0) + 1;
					return m;
				}, {})
			).some((v) => v >= 2)
	}),
	noNeighborSuit: (_) => ({
		objective: `Que ninguna carta repita palo con su vecina.`,
		validate: (table) =>
			!table.some((c, i, a) => i < 3 && c.suit === a[i + 1].suit)
	}),
	sumGroupsEqual: (t) => ({
		objective: `Que la suma de ${t.groupA.join(
			"+"
		)} sea igual a la de ${t.groupB.join("+")}.`,
		validate: (table) => {
			const sum = (g) =>
				table.filter((c) => g.includes(c.suit)).reduce((a, c) => a + c.value, 0);
			return sum(t.groupA) === sum(t.groupB);
		}
	}),
	countOdd: (t) => ({
		objective: `Tener ${t.count} cartas impares.`,
		validate: (table) => table.filter((c) => c.value % 2 === 1).length === t.count
	}),
	minSuit: (t) => ({
		objective: `Que la carta más baja sea de ${t.suit}.`,
		validate: (table) =>
			table.find((c) => c.value === Math.min(...table.map((d) => d.value)))
				.suit === t.suit
	}),
	sumTotalEven: (_) => ({
		objective: `La suma de las cuatro cartas sea un número par.`,
		validate: (table) => table.reduce((a, c) => a + c.value, 0) % 2 === 0
	}),
	hasSequence: (t) => ({
		objective: `Que haya al menos una secuencia numérica de ${t.length}.`,
		validate: (table) => {
			const vs = [...new Set(table.map((c) => c.value))].sort((a, b) => a - b);
			return vs.some(
				(v, i) =>
					i + t.length - 1 < vs.length &&
					vs.slice(i, i + t.length).every((x, j) => x === v + j)
			);
		}
	}),
	maxLE: (t) => ({
		objective: `Ninguna carta sea mayor que ${t.max}.`,
		validate: (table) => table.every((c) => c.value <= t.max)
	}),
	allGT: (t) => ({
		objective: `Que todas las cartas sean mayores de ${t.min}.`,
		validate: (table) => table.every((c) => c.value > t.min)
	}),
	oneEachSuit: (_) => ({
		objective: `Tener precisamente una carta de cada palo.`,
		validate: (table) => new Set(table.map((c) => c.suit)).size === 4
	}),
	sumAtPos: (t) => ({
		objective: `Que las cartas en posiciones ${t.positions
			.map((i) => i + 1)
			.join(" y ")} sumen ${t.sum}.`,
		validate: (table) =>
			t.positions.reduce((a, i) => a + table[i].value, 0) === t.sum
	}),
	distinctSuitCount: (t) => ({
		objective: `Que haya exactamente ${t.count} palos representados.`,
		validate: (table) => new Set(table.map((c) => c.suit)).size === t.count
	}),
	sumSuitMultiple: (t) => ({
		objective: `Que la suma de ${t.suit} sea múltiplo de ${t.multiple}.`,
		validate: (table) =>
			table.filter((c) => c.suit === t.suit).length > 0 &&
			sameSuit.reduce((a, c) => a + c.value, 0) % t.multiple === 0
	}),
	countInList: (t) => ({
		objective: `Que haya al menos ${t.minCount} cartas de valor ${t.values.join(
			", "
		)}.`,
		validate: (table) =>
			table.filter((c) => t.values.includes(c.value)).length >= t.minCount
	}),
	forbidAdjValues: (t) => ({
		objective: `Que ${t.valueA} no esté junto al ${t.valueB}.`,
		validate: (table) =>
			table.every(
				(c, i, a) =>
					c.value !== t.valueA ||
					!(
						(i > 0 && a[i - 1].value === t.valueB) ||
						(i < 3 && a[i + 1].value === t.valueB)
					)
			)
	}),
	sumSuitGE: (t) => ({
		objective: `Que las cartas de ${t.suit} sumen ≥ ${t.total}.`,
		validate: (table) =>
			table.filter((c) => c.suit === t.suit).reduce((a, c) => a + c.value, 0) >=
			t.total
	}),
	maxSuitLE: (t) => ({
		objective: `Ninguna carta de ${t.suit} supere ${t.max}.`,
		validate: (table) =>
			table.filter((c) => c.suit === t.suit).every((c) => c.value <= t.max)
	}),
	sumPosImparGTPar: (_) => ({
		objective: `La suma de valores en posiciones impares sea mayor que en pares.`,
		validate: (table) =>
			table[0].value + table[2].value > table[1].value + table[3].value
	}),
	sumTotalExact: (t) => ({
		objective: `Que la suma total sea exactamente ${t.total}.`,
		validate: (table) => table.reduce((a, c) => a + c.value, 0) === t.total
	}),
	hasValue: (t) => ({
		objective: `Que haya al menos una carta de valor ${t.value}.`,
		validate: (table) => table.some((c) => c.value === t.value)
	}),
	allEven: (_) => ({
		objective: `Que todas las cartas sean pares.`,
		validate: (table) => table.every((c) => c.value % 2 === 0)
	}),
	suitAtPos: (t) => ({
		objective: `Que las cartas de ${t.suit} estén en posición ${t.positions
			.map((i) => i + 1)
			.join(" o ")}.`,
		validate: (table) =>
			table.every((c, i) => (c.suit === t.suit ? t.positions.includes(i) : true))
	}),
	exactConsecutiveCount: (t) => ({
		objective: `Que haya exactamente ${t.count} par consecutivo.`,
		validate: (table) => {
			let cnt = 0;
			for (let i = 0; i < 4; i++)
				for (let j = i + 1; j < 4; j++)
					if (Math.abs(table[i].value - table[j].value) === 1) cnt++;
			return cnt === t.count;
		}
	}),
	minNotSuit: (t) => ({
		objective: `Que la carta más baja no sea de ${t.suit}.`,
		validate: (table) =>
			table.find((c) => c.value === Math.min(...table.map((d) => d.value)))
				.suit !== t.suit
	}),
	sumSuitOdd: (t) => ({
		objective: `Que la suma de ${t.suit} sea impar.`,
		validate: (table) =>
			table.filter((c) => c.suit === t.suit).reduce((a, c) => a + c.value, 0) %
				2 ===
			1
	}),
	sumTotalLT: (t) => ({
		objective: `Que las cuatro cartas sumen menos de ${t.total}.`,
		validate: (table) => table.reduce((a, c) => a + c.value, 0) < t.total
	}),
	valueBetweenNeighbors: (t) => ({
		objective: `Que la carta ${t.value} esté entre dos cartas mayores.`,
		validate: (table) => {
			const i = table.findIndex((c) => c.value === t.value);
			return (
				i > 0 &&
				i < 3 &&
				table[i - 1].value > t.value &&
				table[i + 1].value > t.value
			);
		}
	}),
	suitCountGreater: (t) => ({
		objective: `Que haya más ${t.suitA} que ${t.suitB}.`,
		validate: (table) =>
			table.filter((c) => c.suit === t.suitA).length >
			table.filter((c) => c.suit === t.suitB).length
	}),
	hasSequenceExact: (t) => ({
		objective: `Que haya una escalera de cuatro: ${t.sequences
			.map((s) => s.join("-"))
			.join(" o ")}.`,
		validate: (table) => {
			const vs = new Set(table.map((c) => c.value));
			return t.sequences.some((seq) => seq.every((v) => vs.has(v)));
		}
	}),
	sumSuitExact: (t) => ({
		objective: `Que las cartas de ${t.suit} sumen ${t.total}.`,
		validate: (table) =>
			table.filter((c) => c.suit === t.suit).reduce((a, c) => a + c.value, 0) ===
			t.total
	}),
	minMaxSameSuit: (_) => ({
		objective: `Que la carta más alta y la más baja sean del mismo palo.`,
		validate: (table) => {
			const vals = table.map((c) => c.value);
			const min = Math.min(...vals),
				max = Math.max(...vals);
			return (
				table.find((c) => c.value === min).suit ===
				table.find((c) => c.value === max).suit
			);
		}
	}),
	maxSuitCount: (t) => ({
		objective: `Que no haya más de ${t.maxCount} cartas del mismo palo.`,
		validate: (table) =>
			table.every(
				(c) => table.filter((d) => d.suit === c.suit).length <= t.maxCount
			)
	}),
	diffMinMaxLE: (t) => ({
		objective: `Que la diferencia entre la carta más alta y la más baja sea ≤ ${t.diff}.`,
		validate: (table) =>
			Math.max(...table.map((c) => c.value)) -
				Math.min(...table.map((c) => c.value)) <=
			t.diff
	}),
	suitAtEnds: (_) => ({
		objective: `Que las posiciones 1 y 4 sean del mismo palo.`,
		validate: (table) => table[0].suit === table[3].suit
	}),
	sumPosParExact: (t) => ({
		objective: `Que la suma de las cartas de posición par sea ${t.sum}.`,
		validate: (table) => table[1].value + table[3].value === t.sum
	}),
	hasTriangle: (_) => ({
		objective: `Que exista al menos un 'triángulo' de valores (x, 2x, 3x).`,
		validate: (table) => {
			const vs = table.map((c) => c.value);
			return vs.some((v) => vs.includes(v * 2) && vs.includes(v * 3));
		}
	}),
	allSameParity: (_) => ({
		objective: `Que todas las cartas sean impares o todas sean pares.`,
		validate: (table) =>
			table.every((c) => c.value % 2 === 0) ||
			table.every((c) => c.value % 2 === 1)
	}),
	sumGroupExact: (t) => ({
		objective: `Que la suma de ${t.group.join("+")} sea ${t.total}.`,
		validate: (table) =>
			table
				.filter((c) => t.group.includes(c.suit))
				.reduce((a, c) => a + c.value, 0) === t.total
	}),
	forbidValue: (t) => ({
		objective: `Que no haya cartas de valor ${t.value}.`,
		validate: (table) => table.every((c) => c.value !== t.value)
	}),
	twoPairs: (_) => ({
		objective: `Que las cuatro cartas formen dos parejas de valor idéntico.`,
		validate: (table) =>
			Object.values(
				table.reduce((m, c) => {
					m[c.value] = (m[c.value] || 0) + 1;
					return m;
				}, {})
			).filter((v) => v === 2).length === 2
	})
};

const objectives = ruleTemplates.map((t) => {
	const { objective, validate } = generators[t.kind](t);
	return { id: t.id, objective, coins: t.coins, validate };
});

function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
}

const sinDescriptions = {
        Soberbia:
                "Crees que nada puede derrotarte, pero la soberbia siempre tiene un precio.",
        Avaricia:
                "El deseo de poseerlo todo nubla tu juicio y corrompe tus cartas.",
        Lujuria:
                "Pasiones desmedidas se interponen entre tú y la victoria.",
        Envidia:
                "Anhelas lo que no tienes, perdiendo de vista tu propio poder.",
        Gula:
                "Nunca es suficiente; siempre quieres una carta más.",
        Ira:
                "La furia te consume y desordena tu estrategia.",
        Pereza:
                "La desgana hace más arduo tu camino hacia el abismo."
};

class RoguelikeCardGame {
        constructor({
                deckType = "spanish",
                tableSize = 4,
                handSize = 4,
                objectivesCount = 4
        }) {
                this.deckType = deckType;
                this.tableSize = tableSize;
                this.handSize = handSize;
                this.objectivesCount = objectivesCount;
                this.sins = [
                        "Soberbia",
                        "Avaricia",
                        "Lujuria",
                        "Envidia",
                        "Gula",
                        "Ira",
                        "Pereza"
                ];
                this.sinIndex = 0;
                // objetivos necesarios para el primer pecado y aumento por nivel
                this.baseObjectives = 4;
                this.incrementObjectives = 2;
                this.pendingSinTransition = false;
        }

	initDeck() {
		const suits =
			this.deckType === "spanish"
				? ["bastos", "copas", "espadas", "oros"]
				: ["clubs", "hearts", "spades", "diamonds"];
		const full = shuffle(
			suits.flatMap((s) =>
				Array.from({ length: 10 }, (_, i) => ({ suit: s, value: i + 1 }))
			)
		);
		this.table = full.slice(0, this.tableSize);
		this.deck = full.slice(this.tableSize);
		this.discard = [];
		this.hand = [];
	}

        initObjectives() {
                this.objectivesDeck = shuffle([...objectives]);
                this.activeObjectives = this.objectivesDeck.splice(0, this.objectivesCount);
                this.currentLevel = 1;
                this.completedThisLevel = 0;
                // número de objetivos a completar para el primer pecado
                this.toComplete = this.baseObjectives;
                this.gold = 0;
        }

        startRun() {
                this.initDeck();
                this.initObjectives();
                this.draw(this.handSize);
                this.checkObjectives();
                this.pendingSinTransition = true;
        }

	draw(n = 1) {
		while (n-- > 0) {
			if (!this.deck.length && this.discard.length) {
				this.deck = shuffle(this.discard);
				this.discard = [];
			}
			if (this.deck.length) this.hand.push(this.deck.pop());
		}
	}

	placeCard(handIdx, tableIdx) {
		const card = this.hand[handIdx];
		const target = this.table[tableIdx];
		if (card.suit !== target.suit && card.value !== target.value) return;
		this.hand.splice(handIdx, 1);
		this.discard.push(target);
		this.table[tableIdx] = card;
		this.draw(1);
		this.checkObjectives();
	}

	// ¡Nuevo! completar misión con clic
	completeObjective(idx) {
		const obj = this.activeObjectives[idx];
		if (!obj.validate(this.table)) return;
		this.gold += obj.coins;
		this.completedThisLevel++;
		console.log(`Objetivo ${obj.objective} cumplido: +${obj.coins} monedas`);
		this.activeObjectives.splice(idx, 1);
		if (this.objectivesDeck.length) {
			this.activeObjectives.push(this.objectivesDeck.shift());
		}
		if (this.completedThisLevel >= this.toComplete) this.nextLevel();
	}

        checkObjectives() {
                this.activeObjectives.forEach((o) => {
                        o.isValid = o.validate(this.table);
                });
        }

        applyLevelEffects() {
                const sin = this.sins[this.sinIndex];
                this.applyRandomCurse(sin);
        }

        applyRandomCurse(sin) {
                const curses = {
                        Soberbia: [() => {
                                this.toComplete++;
                                console.log("La soberbia aumenta tus objetivos");
                        }],
                        Avaricia: [() => {
                                this.gold = Math.max(0, this.gold - 5);
                                console.log("La avaricia te roba 5 monedas");
                        }],
                        Lujuria: [() => {
                                this.draw(1);
                                console.log("La lujuria te tienta a robar una carta extra");
                        }],
                        Envidia: [() => {
                                if (this.hand.length) {
                                        this.discard.push(this.hand.pop());
                                        console.log("La envidia se lleva tu "+
                                                "última carta");
                                }
                        }],
                        Gula: [() => {
                                this.deck.splice(0, 1);
                                console.log("La gula consume una carta de tu mazo");
                        }],
                        Ira: [() => {
                                if (this.table.length) {
                                        const i = Math.floor(Math.random() * this.table.length);
                                        this.discard.push(this.table[i]);
                                        this.table[i] = this.deck.pop();
                                        console.log("La ira destruye una carta de la mesa");
                                }
                        }],
                        Pereza: [() => {
                                this.toComplete++;
                                console.log("La pereza retrasa tu avance");
                        }]
                };
                const pool = curses[sin] || [];
                if (pool.length) pool[Math.floor(Math.random() * pool.length)]();
        }

        triggerNarrativeEvent(_) {}

        nextLevel() {
                this.currentLevel++;
                this.sinIndex++;
                // cada nuevo pecado requiere dos objetivos más
                this.toComplete += this.incrementObjectives;
                this.completedThisLevel = 0;
                if (this.sinIndex >= this.sins.length) {
                        alert("Has derrotado todos los pecados. ¡Victoria!");
                        return;
                }
                console.log(`¡Avanzas al nivel ${this.currentLevel} - ${this.sins[this.sinIndex]}!`);
                this.pendingSinTransition = true;
        }

	formatCard(c) {
		return `${c.value} de ${c.suit}`;
	}

	displayStatus() {
		console.log(`Nivel ${this.currentLevel} — Monedas: ${this.gold}`);
		console.log(`Mazo: ${this.deck.length} — Descarte: ${this.discard.length}`);
		console.log("Mesa:", this.table.map((c) => this.formatCard(c)).join(" | "));
		console.log(
			"Mano:",
			this.hand.map((c, i) => `${i}: ${this.formatCard(c)}`).join(" | ")
		);
		console.log(
			"Objetivos:\n" +
				this.activeObjectives
					.map((o) => `${o.id} (${o.coins} monedas): ${o.objective}`)
					.join("\n")
		);
	}
}

// Iniciar partida en consola
const game = new RoguelikeCardGame({ deckType: "spanish" });
//game.startRun();
// Para jugar: game.placeCard(handIndex, tableIndex);

document.addEventListener("DOMContentLoaded", () => {
        const game = new RoguelikeCardGame({ deckType: "spanish" });
        const objContainer = document.querySelector(".objectives");
        const tableContainer = document.querySelector(".table");
        const handContainer = document.querySelector(".hand");
        const scoreSin = document.querySelector(".score-sin");
        const scoreCur = document.querySelector(".score-current");
        const scoreGoal = document.querySelector(".score-goal");
        const scoreCoins = document.querySelector(".score-coins > span");
        const discardCount = document.querySelector(".discard-count");
        const drawCount = document.querySelector(".draw-count");
        const intro = document.getElementById("intro-screen");
        const playBtn = document.getElementById("play-btn");
        const board = document.querySelector(".game-board");
        const transition = document.getElementById("transition-screen");
        const sinTitle = transition.querySelector(".sin-title");
        const sinDesc = transition.querySelector(".sin-description");
        const continueBtn = document.getElementById("continue-btn");
        let selectedHandIdx = null;

        function animateCounter(elem, from, to) {
                const obj = { val: from };
                return gsap.to(obj, {
                        val: to,
                        duration: 0.3,
                        onUpdate: () => {
                                elem.textContent = Math.round(obj.val);
                        }
                });
        }

        function dealInitialCards() {
                return new Promise((resolve) => {
                        tableContainer.innerHTML = "";
                        handContainer.innerHTML = "";
                        objContainer.innerHTML = "";

                        let counter = game.deck.length + game.table.length + game.hand.length;
                        drawCount.textContent = counter;

                        const tl = gsap.timeline({ onComplete: () => {
                                drawCount.textContent = game.deck.length;
                                resolve();
                        }});

                        game.table.forEach((c) => {
                                const d = document.createElement("div");
                                d.className = "table-card card";
                                d.dataset.suit = c.suit;
                                d.dataset.value = c.value;
                                d.style.opacity = 0;
                                d.style.transform = "scale(0)";
                                tableContainer.appendChild(d);
                                tl.to(d, {
                                        scale: 1,
                                        opacity: 1,
                                        duration: 0.3,
                                        ease: "back.out(1.7)",
                                        onStart: () => {
                                                counter--;
                                                animateCounter(drawCount, counter + 1, counter);
                                        }
                                });
                        });

                        game.hand.forEach((c) => {
                                const d = document.createElement("div");
                                d.className = "hand-card card";
                                d.dataset.suit = c.suit;
                                d.dataset.value = c.value;
                                d.style.opacity = 0;
                                d.style.transform = "scale(0)";
                                handContainer.appendChild(d);
                                tl.to(d, {
                                        scale: 1,
                                        opacity: 1,
                                        duration: 0.3,
                                        ease: "back.out(1.7)",
                                        onStart: () => {
                                                counter--;
                                                animateCounter(drawCount, counter + 1, counter);
                                        }
                                });
                        });

                        game.activeObjectives.forEach((o, i) => {
                                const d = document.createElement("div");
                                d.className = "objective-card";
                                d.dataset.index = i;
                                d.innerHTML = `<p>${o.objective}</p><span>${o.coins} 🪙</span>`;
                                d.style.opacity = 0;
                                d.style.transform = "scale(0)";
                                objContainer.appendChild(d);
                                tl.to(d, {
                                        scale: 1,
                                        opacity: 1,
                                        duration: 0.3,
                                        ease: "back.out(1.7)"
                                });
                        });
                });
        }

        function showSinTransition(sin) {
                return new Promise((resolve) => {
                        sinTitle.textContent = sin;
                        sinDesc.textContent = sinDescriptions[sin] || "";
                        transition.classList.remove("hidden");
                        gsap.fromTo(
                                transition,
                                { y: 100, opacity: 0 },
                                { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
                        );
                        continueBtn.onclick = () => {
                                board.classList.add("hidden");
                                gsap.to(transition, {
                                        y: -100,
                                        opacity: 0,
                                        duration: 0.5,
                                        ease: "power2.in",
                                        onComplete: () => {
                                                transition.classList.add("hidden");
                                                game.applyLevelEffects();
                                                game.checkObjectives();
                                                board.classList.remove("hidden");
                                                dealInitialCards().then(resolve);
                                        }
                                });
                        };
                });
        }

        function checkTransition() {
                if (game.pendingSinTransition) {
                        game.pendingSinTransition = false;
                        showSinTransition(game.sins[game.sinIndex]).then(() => {
                                render();
                        });
                }
        }

        function render() {
                // marcador
                scoreSin.textContent = game.sins[game.sinIndex];
                scoreCur.textContent = game.completedThisLevel;
                scoreGoal.textContent = game.toComplete;
                scoreCoins.textContent = `${game.gold}`;
                discardCount.textContent = game.discard.length;
                drawCount.textContent = game.deck.length;

		// misiones
		objContainer.innerHTML = "";
		game.activeObjectives.forEach((o, i) => {
			const d = document.createElement("div");
			d.className = "objective-card" + (o.isValid ? " active" : "");
			d.dataset.index = i;
			d.innerHTML = `<p>${o.objective}</p><span>${o.coins} 🪙</span>`;
			objContainer.appendChild(d);
		});

		// mesa
		tableContainer.innerHTML = "";
		game.table.forEach((c, i) => {
			const d = document.createElement("div");
			d.className = "table-card card";
			d.dataset.index = i;
			d.dataset.suit = c.suit;
			d.dataset.value = c.value;

			// glow solo si puede reemplazarse con la carta seleccionada
			if (selectedHandIdx !== null) {
				const sel = game.hand[selectedHandIdx];
				if (sel && (sel.suit === c.suit || sel.value === c.value)) {
					d.classList.add("can-drop");
				}
			}

			tableContainer.appendChild(d);
		});

		// mano
		handContainer.innerHTML = "";
		game.hand.forEach((c, i) => {
			const d = document.createElement("div");
			d.className = "hand-card card" + (i === selectedHandIdx ? " selected" : "");
			d.dataset.index = i;
			d.dataset.suit = c.suit;
			d.dataset.value = c.value;
			handContainer.appendChild(d);
		});
	}

	// 2) Deselecciona si clicas fuera de mano o mesa
	document.addEventListener("click", (e) => {
		if (!e.target.closest(".hand-card") && !e.target.closest(".table-card")) {
			selectedHandIdx = null;
			render();
		}
	});

	// seleccionar carta de la mano
	handContainer.addEventListener("click", (e) => {
		const c = e.target.closest(".hand-card");
		if (!c) return;
		selectedHandIdx = +c.dataset.index;
		render();
	});

	// jugar carta en la mesa
	tableContainer.addEventListener("click", (e) => {
		const c = e.target.closest(".table-card");
		if (!c || selectedHandIdx === null) return;
		game.placeCard(selectedHandIdx, +c.dataset.index);
		selectedHandIdx = null;
		render();
	});

	// completar misión con clic
        objContainer.addEventListener("click", (e) => {
                const o = e.target.closest(".objective-card");
                if (!o || !o.classList.contains("active")) return;
                game.completeObjective(+o.dataset.index);
                game.checkObjectives(); // recalcula validez
                render();
                checkTransition();
        });

        playBtn.addEventListener("click", () => {
                intro.style.display = "none";
                board.classList.remove("hidden");
                game.startRun();
                render();
                checkTransition();
        });
});
