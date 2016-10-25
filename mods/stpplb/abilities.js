'use strict';

exports.BattleAbilities = { // define custom abilities here.
	"glitchiate": {
		num: 192,
		id: "glitchiate",
		name: "Glitchiate",
		desc: "This Pokemon's moves become ???-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's moves become ??? type and have 1.3x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) { // still boost moves even if they are already ???-type (TM56)
			move.type = '???';
			if (move.category !== 'Status') pokemon.addVolatile('glitchiate');
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]); // multiplies BP by 5325/4096 (~1.3000488), like in the games
			},
		},
		rating: 4,
	},
	"serenegraceplus": {
		num: 193,
		id: "serenegraceplus",
		name: "Serene Grace Plus",
		desc: "This Pokemon's moves have their secondary chances multiplied by 3.",
		shortDesc: "This Pokemon's moves have their secondary chances multiplied by 3.",
		onModifyMovePriority: -2,
		onModifyMove: function (move) {
			if (move.secondaries && move.id !== 'secretpower') {
				for (let i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance *= 3;
				}
			}
		},
		rating: 5,
	},
	'spoopify': {
		num: 194,
		id: "spoopify",
		name: "Spoopify",
		desc: "Makes stuff Ghost on switch-in.",
		shortDesc: "On switch-in, this Pokemon changes all opponents' primary type to Ghost.",
		onStart: function (pokemon) {
			let activeFoe = pokemon.side.foe.active;
			for (let i = 0; i < activeFoe.length; i++) {
				let foe = activeFoe[i];
				let tempTypes = foe.types.slice();
				if (!foe.hasType('Ghost')) {
					tempTypes[0] = 'Ghost';
				} else if (foe.types[0] !== 'Ghost') {
					tempTypes.shift();
				} else {
					continue;
				}
				foe.types = tempTypes;
				this.add('-start', foe, 'typechange', foe.types.join('/'));
			}
		},
		rating: 4,
	},
	/*'scrubterrain': { // MLZekrom pls, Scrub Terrain was really hacky. Happy it's out of the meta.
		num: 195,
		id: 'scrubterrain',
		name: 'Scrub Terrain',
		desc: '',
		shortDesc: '',
		onStart: function (pokemon) {
			this.setWeather('scrubterrain');
		},
		onAnySetWeather: function (target, source, weather) {
			if (this.getWeather().id === 'scrubterrain' && !(weather.id in {desolateland:1, primordialsea:1, deltastream:1, scrubterrain:1})) return false;
		},
		onEnd: function (pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('scrubterrain')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		rating: 4,
	},*/
	'proteon': { // Eeveelutionlvr's ability.
		num: 196,
		id: 'proteon',
		name: 'Proteon',
		desc: "This Pokemon transforms into an Eeveelution to match the type of the move it is about to use, if possible.",
		shortDesc: "This Pokemon transforms into an Eeveelution to match the type of the move it is about to use, if possible.",
		onPrepareHit: function (source, target, move) {
			let type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				let species = '';
				if (type === 'Electric') {
					species = 'Jolteon';
				} else if (type === 'Normal') {
					species = 'Eevee';
				} else if (type === 'Water') {
					species = 'Vaporeon';
				} else if (type === 'Fire') {
					species = 'Flareon';
				} else if (type === 'Psychic') {
					species = 'Espeon';
				} else if (type === 'Dark') {
					species = 'Umbreon';
				} else if (type === 'Ice') {
					species = 'Glaceon';
				} else if (type === 'Grass') {
					species = 'Leafeon';
				} else if (type === 'Fairy') {
					species = 'Sylveon';
				}
				if (species !== '' && source.template.speciesid !== toId(species)) { // don't transform if type is not an eeveelution type or you are already that eeveelution.
					source.formeChange(species);
					this.add('-formechange', source, species, '[msg]');
					source.setAbility('proteon');
				}
			}
		},
		rating: 4.5,
	},
	'swahahahahaggers': { // Sohippy's ability: con on switch-in.
		num: 197,
		id: 'swahahahahaggers',
		name: 'Swahahahahaggers',
		desc: "On switch-in, all opponents become confused for 1 turn, with 70% self-hit chance.",
		shortDesc: "On switch-in, all opponents become confused for 1 turn, with 70% self-hit chance.",
		onStart: function (pokemon) {
			let activeFoe = pokemon.side.foe.active;
			for (let i = 0; i < activeFoe.length; i++) {
				let foe = activeFoe[i];
				foe.addVolatile('sconfusion');
			}
		},
		rating: 4,
	},
	'psychologist': { // Kooma's ability: immune to all "mental" volatile statuses.
		num: 198,
		id: 'psychologist',
		name: 'Psychologist',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "[PLACEHOLDER DESCRIPTION]",
		onUpdate: function (pokemon) {
			let list = ['embargo', 'encore', 'flinch', 'healblock', 'attract', 'nightmare', 'taunt', 'torment', 'confusion', 'sconfusion'];
			for (let i = 0; i < list.length; i++) {
				if (pokemon.volatiles[list[i]]) {
					pokemon.removeVolatile(list[i]);
				}
			}
		},
		onImmunity: function (type, pokemon) {
			let list = ['embargo', 'encore', 'flinch', 'healblock', 'attract', 'nightmare', 'taunt', 'torment', 'confusion', 'sconfusion'];
			for (let i = 0; i < list.length; i++) {
				if (type === list[i]) {
					this.add('-immune', pokemon, list[i]);
					return false;
				}
			}
		},
		rating: 4,
	},
	'seaandsky': { // Kap'n Kooma's ability: Primordial Sea plus Swift Swim.
		num: 199,
		id: 'seaandsky',
		name: 'Sea and Sky',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "[PLACEHOLDER DESCRIPTION]",
		onStart: function (source) {
			this.setWeather('primordialsea');
		},
		onAnySetWeather: function (target, source, weather) {
			if (this.getWeather().id === 'primordialsea' && !(weather.id in {desolateland:1, primordialsea:1, deltastream:1})) return false; // no more Sandstorm overwriting the Heavy Rain!
		},
		onEnd: function (pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && (target.ability === 'primordialsea' || target.ability === 'seaandsky') && (!target.ignore || target.ignore['Ability'] !== true)) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(2);
			}
		},
		rating: 5,
	},
	'littleengine': { // Poomph, the little engine who couldn't. Little moody.
		num: 200,
		id: "littleengine",
		name: "Little Engine",
		desc: "This Pokemon has a random stat raised by 1 stage at the end of each turn.",
		shortDesc: "Raises a random stat by 1 at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			let stats = [], i = '';
			let boost = {};
			for (let i in pokemon.boosts) {
				if (pokemon.boosts[i] < 6) {
					stats.push(i);
				}
			}
			if (stats.length) {
				i = stats[this.random(stats.length)];
				boost[i] = 1;
			}
			this.boost(boost);
		},
		rating: 4.5,
	},
	'furriercoat': { // WhatevsFur, better fur coat, no frz.
		num: 201,
		id: "furriercoat",
		name: "Furrier Coat",
		desc: "This Pokemon's Defense and Sp. Defense are doubled. This Pokemon cannot be frozen.",
		shortDesc: "This Pokemon's Defense and Sp. Defense are doubled. This Pokemon cannot be frozen.",
		onModifyDefPriority: 6,
		onModifyDef: function (def) {
			return this.chainModify(2);
		},
		onModifySpDPriority: 6,
		onModifySpD: function (spd) { //SpD not Spd TriHard
			return this.chainModify(2);
		},
		onImmunity: function (type, pokemon) {
			if (type === 'frz') return false;
		},
		rating: 3.5,
	},
	'nofun': {
		num: 202,
		id: "nofun",
		name: "No Fun",
		desc: "Abilities are fun. No more ability for you.",
		shortDesc: "Abilities are fun. No more ability for you.",
		rating: 0,
	},
	'nofunallowed': {
		num: 203,
		id: "nofunallowed",
		name: "No Fun Allowed",
		desc: "Makes opponent's ability No Fun. Causes all custom moves to fail.",
		shortDesc: "Makes opponent's ability No Fun. Causes all custom moves to fail.",
		onFoeSwitchIn: function (pokemon) {
			let oldAbility = pokemon.setAbility('nofun', pokemon, 'nofun', true);
			if (oldAbility) {
				this.add('-endability', pokemon, oldAbility, '[from] ability: No Fun Allowed');
				this.add('-ability', pokemon, 'No Fun', '[from] ability: No Fun Allowed');
			}
		},
		onStart: function (pokemon) {
			let foeactive = pokemon.side.foe.active;
			for (let i = 0; i < foeactive.length; i++) {
				let foe = foeactive[i];
				let oldAbility = foe.setAbility('nofun', foe, 'nofun', true);
				if (oldAbility) {
					this.add('-endability', foe, oldAbility, '[from] ability: No Fun Allowed');
					this.add('-ability', foe, 'No Fun', '[from] ability: No Fun Allowed');
				}
			}
		},
		onAnyTryMove: function (target, source, effect) {
			if (effect.num > 621) {
				this.attrLastMove('[still]');
				this.add("raw|No Fun Mantis's No Fun Allowed suppressed the signature move!");
				return false;
			}
		},
		rating: 3.5,
	},
	"dictator": {
		num: 204,
		id: "dictator",
		name: "Dictator",
		desc: "On switch-in, this Pokemon lowers the Attack, Special Attack and Speed of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Attack, Special Attack and Speed of adjacent opponents by 1 stage.",
		onStart: function (pokemon) {
			let foeactive = pokemon.side.foe.active;
			let activated = false;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Dictator', 'boost');
					activated = true;
				}
				if (foeactive[i].volatiles['substitute']) {
					this.add('-activate', foeactive[i], 'Substitute', 'ability: Dictator', '[of] ' + pokemon);
				} else {
					this.boost({atk: -1, spa: -1, spe: -1}, foeactive[i], pokemon);
				}
			}
		},
		rating: 4,
	},
	"messiah": {
		num: 205,
		id: "messiah",
		name: "Messiah",
		desc: "This Pokemon blocks certain status moves and instead uses the move against the original user. Increases Sp.Attack by 2 when triggered",
		shortDesc: "This Pokemon blocks certain status moves and bounces them back to the user. Also gets a SpA boost when triggered",
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, target, source);
			this.boost({spa:2}, target);
			return null;
		},
		onAllyTryHitSide: function (target, source, move) {
			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, target, source);
			this.boost({spa:2}, target); // now boosts when bouncing back hazards
			return null;
		},
		effect: {
			duration: 1,
		},
		rating: 4.5,
	},
	'technicality': {
		num: 206,
		rating: 2,
		id: 'technicality',
		name: 'Technicality',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "[PLACEHOLDER DESCRIPTION]",
		onFoeTryMove: function (target, source, effect) {
			if (this.random(10) === 0) {
				this.attrLastMove('[still]');
				this.add("c|" + target.name + "|This move doesn't work because I say so!");
				return false;
			}
		},
	},
	'megaplunder': {
		num: 207,
		id: 'megaplunder',
		name: 'Mega Plunder',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "[PLACEHOLDER DESCRIPTION]",
		rating: 0,
	},
	'pikapower': {
		num: 208,
		id: "pikapower",
		name: "Pika Power",
		desc: "This Pok&#xe9;mon has a 10% chance of exploding if you target it.",
		shortdesc: "May explode when hit.",
		rating: 2,
		onTryHit: function (target, source, move) {
			if (target === source || move.hasBounced) {
				return;
			}
			if (this.random(10) === 1) {
				this.add("c|" + target.name + "|KAPOW");
				let newMove = this.getMoveCopy("explosion");
				this.useMove(newMove, target, source);
				return null;
			}
		},
	},
	'banevade': {
		num: 209,
		id: "banevade",
		name: "Ban Evade",
		desc: "This Pokemon's evasion is evaluated by end of each turn. Higher evasion at lower HP. OHKO moves will fail.",
		shortDesc: "Higher evasion at lower HP. Immune to OHKO.",
		onTryHit: function (pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]');
				return null;
			}
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.hp > pokemon.maxhp / 2 && pokemon.boosts.evasion < 0) {
				this.boost({evasion: 0 - pokemon.boosts.evasion}, pokemon);
			} else if (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hp > pokemon.maxhp / 4 && pokemon.boosts.evasion < 2) {
				this.boost({evasion: 2 - pokemon.boosts.evasion}, pokemon);
			} else if (pokemon.hp <= pokemon.maxhp / 4 && pokemon.hp > pokemon.maxhp / 32 && pokemon.boosts.evasion < 4) {
				this.boost({evasion: 4 - pokemon.boosts.evasion}, pokemon);
			} else if (pokemon.hp <= pokemon.maxhp / 32 && pokemon.boosts.evasion < 6) {
				this.boost({evasion: 6 - pokemon.boosts.evasion}, pokemon);
			}
		},
		rating: 3,
	},
	'incinerate': {
		num: 210,
		id: "incinerate",
		name: "Incinerate",
		desc: "This Pokemon's Normal type moves become Fire type and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal type moves become Fire type and have 1.3x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.id !== 'struggle' && move.type === 'Normal') { // don't mess with Struggle, only change normal moves.
				move.type = 'Fire';
				if (move.category !== 'Status') pokemon.addVolatile('incinerate');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]); // not sure how this one works but this was in the Aerilate code in Pokemon Showdown.
			},
		},
		rating: 3.5,
	},
	'physicalakazam': { // Makes Alakazam into a physical tank
		num: 211,
		id: "physicalakazam",
		name: "Physicalakazam",
		desc: "This Pokemon's Attack is doubled and its Defense is increased 1.5x.",
		shortDesc: "This Pokemon's Attack is doubled and its Defense is increased 1.5x.",
		onModifyDefPriority: 6,
		onModifyDef: function (def) {
			return this.chainModify(1.5);
		},
		onModifyAtkPriority: 6,
		onModifyAtk: function (atk) {
			return this.chainModify(2);
		},
		rating: 3.5,
	},
	"defiantplus": {
		num: 212,
		id: "defiantplus",
		name: "Defiant Plus",
		desc: "This Pokemon's Attack and Speed is raised by 2 stages for each of its stat stages that is lowered by an opposing Pokemon. If this Pokemon has a major status condition, its Speed is multiplied by 1.5; the Speed drop from paralysis is ignored.",
		shortDesc: "This Pokemon's Attack and Speed is raised by 2 for each of its stats that is lowered by a foe. If this Pokemon is statused, its Speed is 1.5x; ignores Speed drop from paralysis.",
		onAfterEachBoost: function (boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			let statsLowered = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({atk: 2, spe: 2});
			}
		},
		onModifySpe: function (spe, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		rating: 2.5,
	},
	'silverscale': { // Abyll's Milotic's ability: Upgraded marvel scale
		num: 213,
		id: "silverscale",
		name: "Silver Scale",
		desc: "If this Pokemon has a major status condition, its Sp Defense is multiplied by 1.5, and Speed by 1.25.",
		shortDesc: "If this Pokemon is statused, its Sp Defense is 1.5x and Speed is 1.25x.",
		onModifySpDPriority: 6,
		onModifySpD: function (spD, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		onModifySpePriority: 6,
		onModifySpe: function (spe, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.25);
			}
		},
		rating: 2.5,
	},
	'gottagofast': { // Pokson's speedboost
		num: 214,
		id: 'gottagofast',
		name: 'Gotta Go Fast',
		desc: "Chance of boosting speed when using signature move",
		shortDesc: "Chance of boost when using special move",
		rating: 2.5,
		onSourceHit: function (target, source, move) {
			if (source && move && (move.id === "boost" || move.id === "spindash")) {
				if (this.random(10) < 3) {
					this.boost({spe: 12}, source);
				}
			}
		},
	},
	'drawingrequest': {
		num: 215,
		id: 'drawingrequest',
		name: 'Drawing Request',
		desc: "At the end of each turn, replaces this Pokemon's first move with a random move from the pool of all Special attacks >= 60 BP and all status moves, minus the ones that boost the user's Attack stat, and the ones this Pokemon already has.",
		shortDesc: 'TL;DR', // DansGame
		rating: 3,
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			let moves = [];
			let movedex = require('./moves.js').BattleMovedex;
			for (let i in movedex) {
				let move = movedex[i];
				if (i !== move.id) continue;
				if (move.isNonstandard) continue;
				if (move.category === 'Physical') continue;
				if (move.basePower < 60 && move.category !== 'Status') continue;
				if (move.category === 'Status' && move.boosts && move.boosts.atk && move.boosts.atk > 0 && move.target === 'self') continue;
				if (pokemon.hasMove(move)) continue;
				moves.push(move);
			}
			let move = '';
			if (moves.length) {
				moves.sort(function (a, b) {return a.num - b.num;});
				move = moves[this.random(moves.length)];
			}
			if (!move) {
				return false;
			}
			pokemon.moveset[0] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			pokemon.moves[0] = toId(move.name);
			this.add('message', pokemon.name + ' acquired a new move using its Drawing Request!');
		},
	},
	"mindgames": {
		num: 216,
		id: "mindgames",
		name: "Mind Games",
		desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it takes direct damage from another Pokemon's attack. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon.",
		shortDesc: "This Pokemon appears as the last Pokemon in the party until it takes direct damage.",
		onBeforeSwitchIn: function (pokemon) {
			pokemon.illusion = null;
			let foe = pokemon.side.foe;
			pokemon.illusion = foe.pokemon[this.random(foe.pokemon.length)];
		},
		// illusion clearing is hardcoded in the damage function
		rating: 4.5,
	},
	'jackyofalltrades': {
		num: 217,
		id: 'jackyofalltrades',
		name: 'Jack(y) of All Trades',
		desc: '[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]',
		shortDesc: '[PLACEHOLDER DESCRIPTION]',
		rating: 4,
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (basePower <= 80) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
	},
	'mirrorguard': {
		num: 218,
		id: 'mirrorguard',
		name: 'Mirror Guard',
		desc: 'Pokemon bounces residual damage. Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage are considered direct damage.',
		shortDesc: 'This Pokemon bounces residual damage.',
		onDamage: function (damage, target, source, effect) {
			console.log(arguments);
			if (effect.effectType === 'Move' || effect.wasMirrored) {
				return;
			}
			let newEffect = Object.create(effect);
			newEffect.wasMirrored = true;
			let foes = target.side.foe.active;
			for (let i = 0; i < foes.length; i++) {
				let foe = foes[i];
				this.damage(damage, foe, source, newEffect);
			}
			return false;
		},
		// Would be totally broken on something holding Toxic Orb.
		// Good thing I haven't done that, right?
		rating: 5,
	},
	'superprotean': {
		num: 219,
		id: 'superprotean',
		name: 'Super Protean',
		desc: 'Adds the type of every move used to the pokemon.',
		shortDesc: 'Gets a shitload of types.',
		onPrepareHit: function (source, target, move) {
			let type = move.type;
			if (!source.hasType(type)) {
				let tempTypes = [];
				for (let i = 0; i < source.types.length; i++) {
					tempTypes[i] = source.types[i];
				}
				tempTypes.push(type);
				source.types = tempTypes;
				this.add('-start', source, 'typechange', source.types.join('/'));
			}
		},
		rating: 4,
	},
	'invocation': {
		num: 220,
		name: 'Invocation',
		id: 'invocation',
		desc: 'Randomly transforms into a fossil god on switch-in.',
		shortDesc: 'Transforms into a fossil.',
		onStart: function (pokemon) {
			let fossils = ['Omastar', 'Kabutops', 'Aerodactyl', 'Cradily', 'Armaldo', 'Bastiodon', 'Rampardos', 'Carracosta', 'Archeops', 'Aurorus', 'Tyrantrum'];
			let fossil = fossils[this.random(fossils.length)];
			pokemon.formeChange(fossil);
			this.add('-formechange', pokemon, fossil, '[msg]');
			let move = 'ancientpower';
			switch (pokemon.template.speciesid) {
			case 'omastar':
				move = 'abstartselect';
				break;
			case 'kabutops':
				move = 'wait4baba';
				break;
			case 'aerodactyl':
				move = 'balancedstrike';
				break;
			case 'cradily':
				move = 'texttospeech';
				break;
			case 'armaldo':
				move = 'holyducttapeofclaw';
				break;
			case 'bastiodon':
				move = 'warecho';
				break;
			case 'rampardos':
				move = 'skullsmash';
				break;
			case 'carracosta':
				move = 'danceriot';
				break;
			case 'archeops':
				move = 'bluescreenofdeath';
				break;
			case 'aurorus':
				move = 'portaltospaaaaaaace';
				break;
			case 'tyrantrum':
				move = 'doubleascent';
				break;
			}
			let index = pokemon.moves.indexOf('godswrath');
			move = this.getMove(move);
			pokemon.moveset[index] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			pokemon.moves[index] = toId(move.name);
		},
		rating: 1,
	},
	'heraldofdeath': {
		num: 221,
		id: 'heraldofdeath',
		name: 'Herald of Death',
		desc: "On switch-in, each adjacent opposing active Pokemon receives a perish count of 4 if it doesn't already have a perish count. At the end of each turn including the turn used, the perish count of all active Pokemon lowers by 1 and Pokemon faint if the number reaches 0. The perish count is removed from Pokemon that switch out. If a Pokemon uses Baton Pass while it has a perish count, the replacement will gain the perish count and continue to count down.",
		shortDesc: 'On switch-in, all adjacent opponents will faint in 3 turns.',
		onStart: function (pokemon) {
			let foeactive = pokemon.side.foe.active;
			let result = false;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!foeactive[i].volatiles['perishsong']) {
					foeactive[i].addVolatile('perishsong');
					this.add('-start', foeactive[i], 'perish3', '[silent]');
					result = true;
				}
			}
			if (result) this.add('message', 'The Herald of Death has arrived. All opposing Pokemon will perish in 3 turns!');
		},
		rating: 3.5,
	},
	"beatmisty": {
		num: 222,
		id: "beatmisty",
		name: "Beat Misty",
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move. This Pokemon has a 10% chance to survive an attack that would KO it with 1 HP.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Water moves; Water immunity. This Pokemon has a 10% chance to survive an attack that would KO it with 1 HP.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Water Absorb');
				}
				return null;
			}
		},
		onDamage: function (damage, target, source, effect) {
			if (this.random(10) === 7 && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add("-activate", target, "ability: Beat Misty");
				return target.hp - 1;
			}
		},
		rating: 3.5,
	},
	"summongoats": {
		num: 222,
		id: "summongoats",
		name: "Summon Goats",
		desc: "Summons additional goats to attack with a fraction of power the higher the current HP is. >79% = 4 goats (5 attacks); 60-79% = 3 goats (4 attacks); 40-59% = 2 goats (3 attacks); 20-39% = 1 goat (2 attacks); <20% = 0 goats (1 attack). Each attack is a multiplier fraction based on this formula: x = 1/y, where y is the number of the hit (so 5 attacks would be 5 hits at 1x, 0.5x, 0.333x, 0.25x, and 0.2x base power, sequentially). Does not affect Status, multihit, self-KO, or spread (in Doubles) moves. tl;dr, Parental Bond with more possible hits.",
		shortDesc: "Summon additional goats to attack, like Parental Bond.",
		//TODO Implement
		rating: 3, //TODO learn wtf a rating is and let azum rate it anyway.
	},
};
