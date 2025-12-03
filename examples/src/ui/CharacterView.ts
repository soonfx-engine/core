/**
 * 角色视图组件 - 用于显示战斗中的角色形象和动画
 */
export class CharacterView {
    private container: HTMLElement;
    private heroElement: HTMLElement | null = null;
    private enemyElement: HTMLElement | null = null;
    private heroHpBar: HTMLElement | null = null;
    private enemyHpBar: HTMLElement | null = null;
    private heroHpText: HTMLElement | null = null;
    private enemyHpText: HTMLElement | null = null;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
        this.container = container;
    }

    /**
     * 初始化角色视图
     */
    public init() {
        this.container.innerHTML = `
            <div class="battle-arena">
                <div class="character-view hero-view" id="heroView">
                    <div class="character-sprite" id="heroSprite">
                        <div class="character-avatar">🦸</div>
                    </div>
                    <div class="character-info">
                        <div class="character-name" id="heroName">Hero</div>
                        <div class="hp-bar-container">
                            <div class="hp-bar" id="heroHpBar">
                                <div class="hp-fill" id="heroHpFill"></div>
                            </div>
                            <div class="hp-text" id="heroHpText">1000/1000</div>
                        </div>
                        <div class="character-stats" id="heroStats">
                            <span>Lv.10</span>
                            <span>ATK: 100</span>
                        </div>
                    </div>
                </div>
                <div class="vs-divider">VS</div>
                <div class="character-view enemy-view" id="enemyView">
                    <div class="character-sprite" id="enemySprite">
                        <div class="character-avatar">👹</div>
                    </div>
                    <div class="character-info">
                        <div class="character-name" id="enemyName">Enemy</div>
                        <div class="hp-bar-container">
                            <div class="hp-bar" id="enemyHpBar">
                                <div class="hp-fill" id="enemyHpFill"></div>
                            </div>
                            <div class="hp-text" id="enemyHpText">1000/1000</div>
                        </div>
                        <div class="character-stats" id="enemyStats">
                            <span>Lv.10</span>
                            <span>ATK: 90</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.heroElement = document.getElementById('heroView');
        this.enemyElement = document.getElementById('enemyView');
        this.heroHpBar = document.getElementById('heroHpFill');
        this.enemyHpBar = document.getElementById('enemyHpFill');
        this.heroHpText = document.getElementById('heroHpText');
        this.enemyHpText = document.getElementById('enemyHpText');
    }

    /**
     * 更新角色数据
     */
    public updateCharacters(hero: any, enemy: any) {
        const heroNameEl = document.getElementById('heroName');
        const enemyNameEl = document.getElementById('enemyName');
        const heroStatsEl = document.getElementById('heroStats');
        const enemyStatsEl = document.getElementById('enemyStats');

        if (heroNameEl) heroNameEl.textContent = hero.name || 'Hero';
        if (enemyNameEl) enemyNameEl.textContent = enemy.name || 'Enemy';

        if (heroStatsEl) {
            heroStatsEl.innerHTML = `
                <span>Lv.${hero.level || 1}</span>
                <span>ATK: ${hero.attack || 0}</span>
            `;
        }

        if (enemyStatsEl) {
            enemyStatsEl.innerHTML = `
                <span>Lv.${enemy.level || 1}</span>
                <span>ATK: ${enemy.attack || 0}</span>
            `;
        }

        this.updateHp(hero.maxHp || hero.hp, hero.maxHp || hero.hp, 'hero');
        this.updateHp(enemy.maxHp || enemy.hp, enemy.maxHp || enemy.hp, 'enemy');
    }

    /**
     * 更新血量显示
     */
    public updateHp(currentHp: number, maxHp: number, side: 'hero' | 'enemy') {
        const hpBar = side === 'hero' ? this.heroHpBar : this.enemyHpBar;
        const hpText = side === 'hero' ? this.heroHpText : this.enemyHpText;

        if (hpBar) {
            const percentage = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
            hpBar.style.width = `${percentage}%`;
            
            // 根据血量百分比改变颜色
            if (percentage > 60) {
                hpBar.style.backgroundColor = '#10b981'; // 绿色
            } else if (percentage > 30) {
                hpBar.style.backgroundColor = '#f59e0b'; // 橙色
            } else {
                hpBar.style.backgroundColor = '#ef4444'; // 红色
            }
        }

        if (hpText) {
            hpText.textContent = `${Math.max(0, Math.round(currentHp))}/${maxHp}`;
        }
    }

    /**
     * 播放落地动画
     */
    public async playLandingAnimation(): Promise<void> {
        return new Promise((resolve) => {
            if (this.heroElement) {
                this.heroElement.style.opacity = '0';
                this.heroElement.style.transform = 'translateY(-100px) scale(0.5)';
                this.heroElement.style.transition = 'none';
            }
            if (this.enemyElement) {
                this.enemyElement.style.opacity = '0';
                this.enemyElement.style.transform = 'translateY(-100px) scale(0.5)';
                this.enemyElement.style.transition = 'none';
            }

            // 触发重排
            void this.heroElement?.offsetHeight;
            void this.enemyElement?.offsetHeight;

            // 英雄落地动画
            if (this.heroElement) {
                this.heroElement.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                this.heroElement.style.opacity = '1';
                this.heroElement.style.transform = 'translateY(0) scale(1)';
            }

            // 敌人落地动画（延迟一点）
            setTimeout(() => {
                if (this.enemyElement) {
                    this.enemyElement.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    this.enemyElement.style.opacity = '1';
                    this.enemyElement.style.transform = 'translateY(0) scale(1)';
                }
            }, 150);

            setTimeout(() => {
                resolve();
            }, 800);
        });
    }

    /**
     * 播放攻击动画
     */
    public async playAttackAnimation(attacker: 'hero' | 'enemy'): Promise<void> {
        return new Promise((resolve) => {
            const attackerEl = attacker === 'hero' ? this.heroElement : this.enemyElement;
            const defenderEl = attacker === 'hero' ? this.enemyElement : this.heroElement;

            if (!attackerEl || !defenderEl) {
                resolve();
                return;
            }

            const sprite = attackerEl.querySelector('.character-sprite') as HTMLElement | null;
            if (!sprite) {
                resolve();
                return;
            }

            // 攻击者向前移动并返回
            const originalTransform = sprite.style.transform || '';
            sprite.style.transition = 'transform 0.3s ease-out';
            sprite.style.transform = attacker === 'hero' 
                ? 'translateX(30px) scale(1.1)' 
                : 'translateX(-30px) scale(1.1)';

            // 受击者闪烁
            defenderEl.style.transition = 'all 0.1s';
            defenderEl.style.filter = 'brightness(1.5)';
            defenderEl.style.transform = 'scale(0.95)';

            setTimeout(() => {
                sprite.style.transform = originalTransform;
                defenderEl.style.filter = '';
                defenderEl.style.transform = '';
                
                setTimeout(() => {
                    resolve();
                }, 300);
            }, 300);
        });
    }

    /**
     * 播放受击动画
     */
    public async playHitAnimation(side: 'hero' | 'enemy', damage: number): Promise<void> {
        const targetEl = side === 'hero' ? this.heroElement : this.enemyElement;
        if (!targetEl) return;

        // 创建伤害数字显示
        const damageText = document.createElement('div');
        damageText.className = 'damage-number';
        damageText.textContent = `-${Math.round(damage)}`;
        damageText.style.position = 'absolute';
        damageText.style.color = '#ef4444';
        damageText.style.fontSize = '18px';
        damageText.style.fontWeight = 'bold';
        damageText.style.pointerEvents = 'none';
        damageText.style.zIndex = '1000';
        damageText.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';

        const sprite = targetEl.querySelector('.character-sprite');
        if (sprite) {
            const rect = sprite.getBoundingClientRect();
            damageText.style.left = `${rect.left + rect.width / 2}px`;
            damageText.style.top = `${rect.top}px`;
            document.body.appendChild(damageText);

            // 动画
            damageText.style.transition = 'all 0.8s ease-out';
            damageText.style.transform = 'translateY(-50px)';
            damageText.style.opacity = '0';

            setTimeout(() => {
                document.body.removeChild(damageText);
            }, 800);
        }

        // 角色闪烁
        targetEl.style.transition = 'filter 0.2s';
        targetEl.style.filter = 'brightness(1.5)';
        setTimeout(() => {
            targetEl.style.filter = '';
        }, 200);
    }

    /**
     * 播放胜利/失败动画
     */
    public playVictoryAnimation(winner: 'hero' | 'enemy'): void {
        const winnerEl = winner === 'hero' ? this.heroElement : this.enemyElement;
        const loserEl = winner === 'hero' ? this.enemyElement : this.heroElement;

        if (winnerEl) {
            winnerEl.style.transition = 'all 0.5s';
            winnerEl.style.transform = 'scale(1.1)';
            winnerEl.style.filter = 'brightness(1.2) drop-shadow(0 0 20px rgba(16, 185, 129, 0.8))';
        }

        if (loserEl) {
            loserEl.style.transition = 'all 0.5s';
            loserEl.style.opacity = '0.5';
            loserEl.style.filter = 'grayscale(100%)';
        }
    }

    /**
     * 重置动画状态
     */
    public reset(): void {
        if (this.heroElement) {
            this.heroElement.style.transform = '';
            this.heroElement.style.opacity = '';
            this.heroElement.style.filter = '';
        }
        if (this.enemyElement) {
            this.enemyElement.style.transform = '';
            this.enemyElement.style.opacity = '';
            this.enemyElement.style.filter = '';
        }
    }

    /**
     * 显示/隐藏视图
     */
    public setVisible(visible: boolean): void {
        this.container.style.display = visible ? 'block' : 'none';
    }
}

