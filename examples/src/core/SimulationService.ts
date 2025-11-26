import FxUtil from "../utils/FxUtil";
import { BattleLogger } from "./BattleLogger";
import { BattleEntity } from "./BattleEntity";
import { BattleSimulator } from "./BattleSimulator";

let fxInit = false;

export async function initFx() {
    if (fxInit) {
        return;
    }
    // 加载配置
    const fxUtil = FxUtil.getInstance();
    try {
        const response = await fetch('./assets/fx.json');
        const seerConfig = await response.json();
        fxUtil.loadConfig(seerConfig);
        fxInit = true;
    } catch (e) {
        console.error("Failed to load fx.json", e);
    }
}

/**
 * 生成指定范围的PVE测试数据
 */
export async function generatePVEDataRange(onProgress?: (data: any[], level: number, total: number) => void, count: number = 50, startLevel: number = 1) {
    const data: any[] = [];
    const maxLevel = startLevel + count - 1;

    await initFx();
    const seerUtil = FxUtil.getInstance();

    for (let level = startLevel; level <= maxLevel; level++) {
        await new Promise(resolve => requestAnimationFrame(() => resolve(true)));

        try {
            const logger = new BattleLogger();
            const heroData = seerUtil.getInstanceDataByNameAndOccuAndLevel("主角1", 1, level);
            const hero = new BattleEntity("Hero", heroData.hp, heroData.attack, heroData.defense, level, 1);
            const enemyData = seerUtil.getInstanceDataByNameAndOccuAndLevel("怪物1", 1, level);
            const enemy = new BattleEntity("Enemy", enemyData.hp, enemyData.attack, enemyData.defense, level, 1);

            const simulator = new BattleSimulator(hero, enemy, logger);
            const result = simulator.startBattle();

            let totalHeroDamage = 0;
            let damageCount = 0;
            if (result.battleData && result.battleData.length > 0) {
                for (const roundData of result.battleData) {
                    if (roundData.heroDamageDealt !== undefined) {
                        totalHeroDamage += roundData.heroDamageDealt;
                        damageCount++;
                    }
                }
            }
            const averageHeroDamage = damageCount > 0 ? totalHeroDamage / damageCount : 0;

            data.push({
                level: level,
                hp: hero.currentHp,
                damage: averageHeroDamage,
                rounds: result.rounds,
                battleData: result.battleData,
                heroName: "Hero",
                enemyName: "Enemy"
            });

            if (onProgress) onProgress(data, level, maxLevel);

        } catch (error) {
            console.error(`Level ${level} battle simulation failed:`, error);
            data.push({
                level: level,
                hp: 100,
                damage: 20,
                rounds: 10,
                battleData: [],
                heroName: "Hero",
                enemyName: "Enemy"
            });
            if (onProgress) onProgress(data, level, maxLevel);
        }
    }

    return data;
}

/**
 * 生成PVE测试数据（默认1-50级）
 */
export async function generatePVEData(onProgress?: (data: any[], level: number, total: number) => void, maxLevel: number = 50) {
    return generatePVEDataRange(onProgress, maxLevel, 1);
}

