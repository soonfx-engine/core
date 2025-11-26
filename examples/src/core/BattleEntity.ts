/**
 * 战斗实体类 - 表示战斗中的一个角色（主角或敌人）
 */
export class BattleEntity {
    name: string;           // 角色名称
    maxHp: number;          // 最大生命值
    currentHp: number;      // 当前生命值
    attack: number;         // 攻击力
    defense: number;        // 防御力
    level: number;          // 等级
    occupation: number;     // 职业

    constructor(
        name: string,
        hp: number,
        attack: number,
        defense: number,
        level: number = 1,
        occupation: number = 1
    ) {
        this.name = name;
        this.maxHp = hp;
        this.currentHp = hp;
        this.attack = attack;
        this.defense = defense;
        this.level = level;
        this.occupation = occupation;
    }

    /**
     * 判断角色是否存活
     */
    isAlive(): boolean {
        return this.currentHp > 0;
    }

    /**
     * 受到伤害
     * @param damage 伤害值
     * @returns 实际受到的伤害
     */
    takeDamage(damage: number): number {
        const actualDamage = Math.max(1, damage - this.defense); // 最少造成1点伤害
        this.currentHp = Math.max(0, this.currentHp - actualDamage);
        return actualDamage;
    }

    /**
     * 获取角色状态信息
     */
    getStatus(): string {
        return `${this.name} [Lv.${this.level}] HP: ${this.currentHp}/${this.maxHp} | 攻击: ${this.attack} | 防御: ${this.defense}`;
    }

    /**
     * 获取血量百分比
     */
    getHpPercentage(): number {
        return (this.currentHp / this.maxHp) * 100;
    }
}
