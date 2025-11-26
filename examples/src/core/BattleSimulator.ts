import { BattleEntity } from './BattleEntity';
import { BattleLogger } from './BattleLogger';

/**
 * 战斗模拟器 - 模拟两个角色之间的战斗
 */
export class BattleSimulator {
    private logger: BattleLogger;
    private hero: BattleEntity;
    private enemy: BattleEntity;
    private round: number = 0;
    private maxRounds: number = 100; // 最大回合数，防止无限循环

    constructor(hero: BattleEntity, enemy: BattleEntity, logger: BattleLogger) {
        this.hero = hero;
        this.enemy = enemy;
        this.logger = logger;
    }

    /**
     * 计算伤害
     * @param attacker 攻击者
     * @param defender 防御者
     * @returns 伤害值
     */
    private calculateDamage(attacker: BattleEntity, defender: BattleEntity): number {
        // 基础伤害 = 攻击力 - 防御力
        let damage = attacker.attack - defender.defense;

        // 添加一些随机性（80% - 120%）
        const randomFactor = 0.8 + Math.random() * 0.4;
        damage = Math.floor(damage * randomFactor);

        // 最少造成1点伤害
        return Math.max(1, damage);
    }

    /**
     * 执行一次攻击
     * @param attacker 攻击者
     * @param defender 防御者
     * @returns 实际造成的伤害
     */
    private executeAttack(attacker: BattleEntity, defender: BattleEntity): number {
        const damage = this.calculateDamage(attacker, defender);
        const actualDamage = defender.takeDamage(damage);

        this.logger.addLog(
            `  ${attacker.name} 攻击 ${defender.name}，造成 ${actualDamage} 点伤害！` +
            `（${defender.name} 剩余血量: ${defender.currentHp}/${defender.maxHp}）`
        );

        return actualDamage;
    }

    /**
     * 战斗一回合
     * @returns 战斗是否结束
     */
    private battleRound(): boolean {
        this.round++;
        this.logger.addLog(`\n----- 第 ${this.round} 回合 -----`);
        this.logger.addLog(`${this.hero.getStatus()}`);
        this.logger.addLog(`${this.enemy.getStatus()}`);

        // 记录回合开始时的数据
        const roundStartData = {
            heroHp: this.hero.currentHp,
            heroHpPercent: this.hero.getHpPercentage(),
            enemyHp: this.enemy.currentHp,
            enemyHpPercent: this.enemy.getHpPercentage()
        };

        // 主角先攻击
        const heroDamage = this.executeAttack(this.hero, this.enemy);

        const updateBattleData = () => {
            roundStartData.enemyHp = this.enemy.currentHp;
            roundStartData.enemyHpPercent = this.enemy.getHpPercentage();
            roundStartData.heroHp = this.hero.currentHp;
            roundStartData.heroHpPercent = this.hero.getHpPercentage();
        }
        // 检查敌人是否被击败
        if (!this.enemy.isAlive()) {
            updateBattleData();
            this.logger.addLog(`\n🎉 ${this.enemy.name} 被击败了！`);
            this.logger.addRoundData(this.round, {
                ...roundStartData,
                heroDamageDealt: heroDamage,
                enemyDamageDealt: 0,
                winner: this.hero.name,
                battleEnd: true
            });
            return true;
        }

        // 敌人反击
        const enemyDamage = this.executeAttack(this.enemy, this.hero);

        // 检查主角是否被击败
        if (!this.hero.isAlive()) {
            this.logger.addLog(`\n💀 ${this.hero.name} 被击败了！`);
            updateBattleData();
            this.logger.addRoundData(this.round, {
                ...roundStartData,
                heroDamageDealt: heroDamage,
                enemyDamageDealt: enemyDamage,
                winner: this.enemy.name,
                battleEnd: true
            });
            return true;
        }

        updateBattleData();
        // 记录回合数据
        this.logger.addRoundData(this.round, {
            ...roundStartData,
            heroDamageDealt: heroDamage,
            enemyDamageDealt: enemyDamage,
            battleEnd: false
        });

        return false;
    }

    /**
     * 开始战斗
     * @returns 战斗结果
     */
    public startBattle(): { winner: string, rounds: number, battleData: any[] } {
        this.logger.addLog('\n========================================');
        this.logger.addLog('⚔️  战斗开始！');
        this.logger.addLog('========================================');
        this.logger.addLog(`${this.hero.getStatus()}`);
        this.logger.addLog(`VS`);
        this.logger.addLog(`${this.enemy.getStatus()}`);
        this.logger.addLog('========================================\n');

        // 战斗循环
        while (this.round < this.maxRounds) {
            const battleEnded = this.battleRound();

            if (battleEnded) {
                break;
            }
        }

        // 检查是否达到最大回合数
        if (this.round >= this.maxRounds) {
            this.logger.addLog('\n⏱️  战斗超时，平局！');
        }

        // 生成战斗总结
        const winner = this.hero.isAlive() ? this.hero.name : (this.enemy.isAlive() ? this.enemy.name : '平局');

        this.logger.addLog('\n========================================');
        this.logger.addLog('📊 战斗结束统计');
        this.logger.addLog('========================================');
        this.logger.addLog(`胜利者: ${winner}`);
        this.logger.addLog(`总回合数: ${this.round}`);
        this.logger.addLog(`${this.hero.name} 最终状态: ${this.hero.getStatus()}`);
        this.logger.addLog(`${this.enemy.name} 最终状态: ${this.enemy.getStatus()}`);
        this.logger.addLog('========================================\n');

        // (window as any).battleData = this.logger.getBattleData()
        // debugger;
        return {
            winner,
            rounds: this.round,
            battleData: this.logger.getBattleData()
        };
    }
}
