import { ChartController } from "./ChartController";
import { CharacterView } from "./CharacterView";
import { i18n } from "../i18n/I18nService";
import FxUtil from "../utils/FxUtil";
import { initFx } from "../core/SimulationService";

const SCENARIO_KEYS: { [key: string]: { title: string, desc: string } } = {
    'pve-growth': {
        title: 'story.pveGrowth.title',
        desc: 'story.pveGrowth.desc'
    },
    'newbie': {
        title: 'story.newbie.title',
        desc: 'story.newbie.desc'
    },
    'mid-game': {
        title: 'story.midGame.title',
        desc: 'story.midGame.desc'
    },
    'custom-battle': {
        title: 'story.custom.title',
        desc: 'story.custom.desc'
    }
};

export class DemoApp {
    private chartController: ChartController;
    private characterView: CharacterView | null = null;
    private currentScenario: string = 'pve-growth';
    private pveBattleData: any[] | null = null;
    private currentLevel: number | null = null;
    private isRunning: boolean = false;
    private shouldStop: boolean = false;
    private chartUpdateTimer: number | null = null;

    // Preset configurations
    private static readonly PRESETS: { [key: string]: { hero: any, enemy: any } } = {
        balanced: {
            hero: { level: 10, hp: 1000, atk: 100, def: 20 },
            enemy: { level: 10, hp: 1000, atk: 100, def: 20 }
        },
        heroStrong: {
            hero: { level: 15, hp: 1500, atk: 150, def: 30 },
            enemy: { level: 10, hp: 800, atk: 80, def: 15 }
        },
        enemyStrong: {
            hero: { level: 10, hp: 800, atk: 80, def: 15 },
            enemy: { level: 15, hp: 1500, atk: 150, def: 30 }
        },
        tank: {
            hero: { level: 10, hp: 2000, atk: 60, def: 50 },
            enemy: { level: 10, hp: 800, atk: 120, def: 10 }
        },
        glass: {
            hero: { level: 10, hp: 500, atk: 200, def: 5 },
            enemy: { level: 10, hp: 1200, atk: 80, def: 25 }
        }
    };

    constructor() {
        this.chartController = new ChartController((index) => this.showBattleDetail(index));
        try {
            this.characterView = new CharacterView('characterViewContainer');
            this.characterView.init();
        } catch (e) {
            console.warn('CharacterView container not found, character view disabled');
        }
    }

    public async init() {
        console.log('Battle simulation system initialized');
        
        // Initialize i18n first
        i18n.updatePage();
        
        this.bindEvents();
        this.redirectConsole();

        await this.chartController.initCharts();
        
        // Auto-run default scenario
        await this.selectScenario('custom-battle');

        // Subscribe to language changes
        i18n.subscribe(() => {
            this.updateStoryHeader(this.currentScenario);
            // Re-render status if needed
            // Re-render charts if needed (charts usually have their own titles, might need update)
            // For simplicity, we might re-run scenario or just update text
            if (this.pveBattleData && this.currentLevel !== null) {
                 // Try to refresh current detail view text
                 // This is a bit complex because logs are appended. 
                 // We'll just update the static parts.
            }
        });
    }

    private bindEvents() {
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const scenario = target.dataset.scenario;
                if (scenario) {
                    this.selectScenario(scenario);
                }
            });
        });

        const startCustomBtn = document.getElementById('startCustomBattle');
        if (startCustomBtn) {
            startCustomBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Start Custom Battle clicked');
                if (!this.isRunning) {
                    this.runCustomBattle();
                }
            });
        }

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const presetKey = target.dataset.preset;
                if (presetKey && DemoApp.PRESETS[presetKey]) {
                    this.applyPreset(presetKey);
                    // Update active state
                    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                    target.classList.add('active');
                }
            });
        });

        const langSwitch = document.getElementById('langSwitch');
        if (langSwitch) {
            langSwitch.addEventListener('click', () => {
                i18n.toggleLocale();
            });
        }
    }

    private redirectConsole() {
        const originalLog = console.log;
        console.log = (...args: any[]) => {
            originalLog.apply(console, args);
            // Only log to output if it's a string message, to avoid cluttering with objects
            // or you can implement a smarter filter
            const outputEl = document.getElementById('output');
            if (outputEl) {
                // Optional: Uncomment if you want to stream logs to the div
                // const message = args.map(arg => 
                //     typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                // ).join(' ');
                // outputEl.textContent += message + '\n';
                // outputEl.scrollTop = outputEl.scrollHeight;
            }
        };
    }

    private updateStoryHeader(scenario: string) {
        const keys = SCENARIO_KEYS[scenario];
        if (keys) {
            const titleEl = document.getElementById('storyTitle');
            const descEl = document.getElementById('storyDesc');
            if (titleEl) titleEl.textContent = i18n.t(keys.title);
            if (descEl) descEl.textContent = i18n.t(keys.desc);
        }
    }

    public async selectScenario(scenario: string) {
        // Stop any running simulation
        if (this.isRunning) {
            this.shouldStop = true;
            // Wait for running tasks to actually stop (check every 50ms, max 2s)
            let waitCount = 0;
            while (this.isRunning && waitCount < 40) {
                await new Promise(r => setTimeout(r, 50));
                waitCount++;
            }
            // Force reset if still running after timeout
            if (this.isRunning) {
                this.isRunning = false;
                console.warn('Force stopped running task after timeout');
            }
        }
        this.shouldStop = false;

        // Reset button state if it was running
        const startBtn = document.getElementById('startCustomBattle');
        if (startBtn) {
            startBtn.classList.remove('running');
            startBtn.querySelector('.label')!.textContent = '⚔️ ' + i18n.t('custom.start');
        }

        // Update active button
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.classList.remove('active');
            const target = btn as HTMLElement;
            if (target.dataset.scenario === scenario) {
                btn.classList.add('active');
            }
        });

        this.currentScenario = scenario;
        this.updateStoryHeader(scenario);

        // Update Chart Titles based on scenario
        const hpTitle = document.getElementById('hpChartTitle');
        const damageTitle = document.getElementById('damageChartTitle');
        const roundsTitle = document.getElementById('roundsChartTitle');
        const roundsChartCard = roundsTitle?.closest('.chart-card') as HTMLElement;

        if (scenario === 'custom-battle') {
            if (hpTitle) hpTitle.setAttribute('data-i18n', 'charts.hpByRound');
            if (damageTitle) damageTitle.setAttribute('data-i18n', 'charts.damageByRound');
            // Custom Battle 中 HP % by Round 与 HP by Round 重复，隐藏该图表
            if (roundsChartCard) roundsChartCard.style.display = 'none';
        } else {
            if (hpTitle) hpTitle.setAttribute('data-i18n', 'charts.hpByLevel');
            if (damageTitle) damageTitle.setAttribute('data-i18n', 'charts.damageByLevel');
            if (roundsTitle) roundsTitle.setAttribute('data-i18n', 'charts.roundsByLevel');
            if (roundsChartCard) roundsChartCard.style.display = 'block';
        }
        i18n.updatePage();

        // Clear previous data
        this.clearOutput();
        this.chartController.clearCharts();

        // Show placeholders
        document.getElementById('hpPlaceholder')?.classList.remove('hidden');
        document.getElementById('damagePlaceholder')?.classList.remove('hidden');
        document.getElementById('roundsPlaceholder')?.classList.remove('hidden');

        // Toggle Config Panel
        const configPanel = document.getElementById('customConfigPanel');
        if (scenario === 'custom-battle') {
            if (configPanel) configPanel.style.display = 'block';
            // Hide placeholders for custom battle as we don't run auto-sim immediately
            document.getElementById('hpPlaceholder')?.classList.add('hidden');
            document.getElementById('damagePlaceholder')?.classList.add('hidden');
            document.getElementById('roundsPlaceholder')?.classList.add('hidden');
            // Show character view
            if (this.characterView) {
                this.characterView.setVisible(true);
                const characterContainer = document.getElementById('characterViewContainer');
                if (characterContainer) characterContainer.style.display = 'block';
            }
            // Auto-start battle when switching to custom-battle
            setTimeout(() => {
                if (!this.isRunning) {
                    this.runCustomBattle();
                }
            }, 100);
        } else {
            if (configPanel) configPanel.style.display = 'none';
            // Hide character view
            if (this.characterView) {
                this.characterView.setVisible(false);
                const characterContainer = document.getElementById('characterViewContainer');
                if (characterContainer) characterContainer.style.display = 'none';
            }
            // Run simulation
            await this.runScenario(scenario);
        }
    }

    private async runScenario(scenario: string) {
        if (scenario === 'custom-battle') return; // Handled by manual button

        this.setStatus('loading', i18n.t('status.running', { scenario }));

        try {
            switch (scenario) {
                case 'pve-growth':
                    await this.showPVEGrowthCurve(50);
                    break;
                case 'newbie':
                    await this.showPVEGrowthCurve(10, 1);
                    break;
                case 'mid-game':
                    await this.showPVEGrowthCurve(30, 20);
                    break;
            }

            this.setStatus('success', i18n.t('status.success'));
        } catch (error: any) {
            console.error('Simulation error:', error);
            this.setStatus('error', i18n.t('status.error', { message: error.message }));
        }
    }

    private applyPreset(presetKey: string) {
        const preset = DemoApp.PRESETS[presetKey];
        if (!preset) return;

        const setValue = (id: string, value: number) => {
            const el = document.getElementById(id) as HTMLInputElement;
            if (el) el.value = String(value);
        };

        setValue('heroLevel', preset.hero.level);
        setValue('heroHp', preset.hero.hp);
        setValue('heroAtk', preset.hero.atk);
        setValue('heroDef', preset.hero.def);

        setValue('enemyLevel', preset.enemy.level);
        setValue('enemyHp', preset.enemy.hp);
        setValue('enemyAtk', preset.enemy.atk);
        setValue('enemyDef', preset.enemy.def);

        // Update character view if visible
        if (this.characterView && this.currentScenario === 'custom-battle') {
            this.characterView.updateCharacters(
                { name: 'Hero', level: preset.hero.level, hp: preset.hero.hp, maxHp: preset.hero.hp, attack: preset.hero.atk, defense: preset.hero.def },
                { name: 'Enemy Boss', level: preset.enemy.level, hp: preset.enemy.hp, maxHp: preset.enemy.hp, attack: preset.enemy.atk, defense: preset.enemy.def }
            );
        }
    }

    private async runCustomBattle() {
        console.log('runCustomBattle called, isRunning:', this.isRunning);
        if (this.isRunning) return;
        
        const getValue = (id: string) => {
            const el = document.getElementById(id) as HTMLInputElement;
            const val = parseInt(el?.value) || 0;
            const min = parseInt(el?.min) || 0;
            const max = parseInt(el?.max) || 999999;
            return Math.max(min, Math.min(max, val));
        };

        const heroLevel = getValue('heroLevel');
        const heroHp = getValue('heroHp');
        const heroAtk = getValue('heroAtk');
        const heroDef = getValue('heroDef');

        const enemyLevel = getValue('enemyLevel');
        const enemyHp = getValue('enemyHp');
        const enemyAtk = getValue('enemyAtk');
        const enemyDef = getValue('enemyDef');
        const simCount = Math.max(1, Math.min(1000, getValue('simCount') || 1));

        console.log('Custom Battle Config:', { heroLevel, heroHp, heroAtk, heroDef, enemyLevel, enemyHp, enemyAtk, enemyDef, simCount });

        // Validation
        if (heroHp <= 0 || heroAtk <= 0 || enemyHp <= 0 || enemyAtk <= 0) {
            this.setStatus('error', 'Invalid stats: HP and Attack must be > 0');
            return;
        }

        this.isRunning = true;
        this.setStatus('loading', i18n.t('status.running', { scenario: 'Custom' }));
        this.clearOutput();

        // Update button state to show running
        const startBtn = document.getElementById('startCustomBattle');
        if (startBtn) {
            startBtn.classList.add('running');
            startBtn.querySelector('.label')!.textContent = '⚔️ ' + i18n.t('custom.running');
        }

        // Show and update character view
        if (this.characterView) {
            this.characterView.setVisible(true);
            const characterContainer = document.getElementById('characterViewContainer');
            if (characterContainer) characterContainer.style.display = 'block';
            
            // Update character data
            this.characterView.updateCharacters(
                { name: 'Hero', level: heroLevel, hp: heroHp, maxHp: heroHp, attack: heroAtk, defense: heroDef },
                { name: 'Enemy Boss', level: enemyLevel, hp: enemyHp, maxHp: enemyHp, attack: enemyAtk, defense: enemyDef }
            );
            
            // Reset and play landing animation
            this.characterView.reset();
            await this.characterView.playLandingAnimation();
        }

        // Show progress bar for batch simulations
        const progressContainer = document.getElementById('customProgress');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        if (simCount > 1 && progressContainer) {
            progressContainer.style.display = 'block';
        }

        try {
            const { BattleEntity } = await import('../core/BattleEntity');
            const { BattleSimulator } = await import('../core/BattleSimulator');
            const { BattleLogger } = await import('../core/BattleLogger');

            // Run simulations
            let wins = 0;
            let totalRounds = 0;
            let totalHeroHp = 0;
            let minRounds = Infinity;
            let maxRounds = 0;
            let lastResult: any = null;

            const batchSize = 50; // Process in batches for UI responsiveness
            
            for (let i = 0; i < simCount; i++) {
                // Check if should stop
                if (this.shouldStop) {
                    console.log('Simulation stopped by user');
                    return;
                }

                // Yield to UI every batchSize iterations
                if (i > 0 && i % batchSize === 0) {
                    await new Promise(r => requestAnimationFrame(r));
                    // Update progress
                    if (progressBar && progressText) {
                        const percent = Math.round((i / simCount) * 100);
                        progressBar.style.width = `${percent}%`;
                        progressText.textContent = `${i} / ${simCount} (${percent}%)`;
                    }
                }

                // Only log the last one to avoid console spam
                const isLast = i === simCount - 1;
                const logger = new BattleLogger(!isLast); 

                const hero = new BattleEntity("Hero", heroHp, heroAtk, heroDef, heroLevel);
                const enemy = new BattleEntity("Enemy Boss", enemyHp, enemyAtk, enemyDef, enemyLevel);
                const simulator = new BattleSimulator(hero, enemy, logger);

                // For single simulation, play battle animations
                let result: any;
                if (simCount === 1 && this.characterView) {
                    result = await this.playAnimatedBattle(hero, enemy, simulator);
                    // Check if stopped during animation
                    if (this.shouldStop) {
                        console.log('Simulation stopped during battle animation');
                        return;
                    }
                } else {
                    result = simulator.startBattle();
                }
                
                if (result.winner === "Hero") {
                    wins++;
                }
                totalRounds += result.rounds;
                minRounds = Math.min(minRounds, result.rounds);
                maxRounds = Math.max(maxRounds, result.rounds);
                // Find final hero hp
                const lastRound = result.battleData[result.battleData.length - 1];
                totalHeroHp += lastRound ? lastRound.heroHp : 0;

                if (isLast) {
                    lastResult = result;
                }
            }

            if (!lastResult) throw new Error("Simulation failed");

            // Hide progress bar
            if (progressContainer) {
                progressContainer.style.display = 'none';
                if (progressBar) progressBar.style.width = '0%';
            }

            // Display logic
            if (simCount > 1) {
                 const outputEl = document.getElementById('output');
                 if (outputEl) {
                     outputEl.textContent = '';
                     const winRate = ((wins / simCount) * 100).toFixed(1);
                     const avgRounds = (totalRounds / simCount).toFixed(1);
                     const avgHp = (totalHeroHp / simCount).toFixed(0);
                     const losses = simCount - wins;
                     
                     const report = `
${i18n.t('custom.report.title', { count: simCount })}
────────────────────────────────
${i18n.t('custom.report.winRate', { rate: winRate })}
${i18n.t('custom.report.losses', { count: losses })}
${i18n.t('custom.report.avgRounds', { rounds: avgRounds })}
${i18n.t('custom.report.minRounds', { rounds: minRounds })}
${i18n.t('custom.report.maxRounds', { rounds: maxRounds })}
${i18n.t('custom.report.avgHeroHp', { hp: avgHp })}
────────────────────────────────

${i18n.t('status.battleDetails.header', { level: heroLevel })}
${i18n.t('status.battleDetails.duration', { rounds: lastResult.rounds })}
${i18n.t('status.battleDetails.hp', { hp: Math.round(lastResult.battleData[lastResult.battleData.length - 1].heroHp) })}
`;
                     outputEl.textContent = report;
                 }
            } else {
                // Single run - standard display handled by showBattleDetail below (via fake pveBattleData)
            }
            
            // Construct a single data point for the detail view (using the LAST run)
            const battleDataPoint = {
                level: heroLevel,
                hp: lastResult.battleData[lastResult.battleData.length - 1].heroHp, 
                damage: lastResult.battleData.reduce((acc: number, r: any) => acc + r.heroDamageDealt, 0) / lastResult.rounds,
                rounds: lastResult.rounds,
                battleData: lastResult.battleData,
                heroName: "Hero",
                enemyName: "Enemy Boss"
            };

            // Update pveBattleData to contain this single battle so showBattleDetail works
            this.pveBattleData = [battleDataPoint];
            
            // Custom Battle 模式下主图表显示 Round 数据，不需要调用 updateCharts (它会重置为 Level 数据)
            // this.chartController.updateCharts([battleDataPoint], heroLevel);
            
            // 显示主图表（回合数据）- 必须在 showBattleDetail 之前调用
            this.chartController.updateChartsWithBattleRounds(
                lastResult.battleData, 
                battleDataPoint.heroName, 
                battleDataPoint.enemyName
            );
            
            // 显示详情图表
            this.showCustomBattleDetail(battleDataPoint);
            
            // 更新最终角色状态
            if (this.characterView && lastResult) {
                const finalRound = lastResult.battleData[lastResult.battleData.length - 1];
                if (finalRound) {
                    this.characterView.updateHp(finalRound.heroHp, heroHp, 'hero');
                    this.characterView.updateHp(finalRound.enemyHp, enemyHp, 'enemy');
                }
            }
            
            this.setStatus('success', i18n.t('status.success'));

        } catch (e: any) {
             this.setStatus('error', e.message);
             // Hide progress bar on error
             if (progressContainer) progressContainer.style.display = 'none';
        } finally {
            this.isRunning = false;
            // Reset button state
            const startBtn = document.getElementById('startCustomBattle');
            if (startBtn) {
                startBtn.classList.remove('running');
                startBtn.querySelector('.label')!.textContent = '⚔️ ' + i18n.t('custom.start');
            }
        }
    }

    /**
     * 播放带动画的战斗
     */
    private async playAnimatedBattle(hero: any, enemy: any, simulator: any): Promise<any> {
        if (!this.characterView) {
            return simulator.startBattle();
        }

        // 创建一个自定义的战斗模拟器，逐步执行战斗
        const battleData: any[] = [];
        let round = 0;
        const maxRounds = 100;
        await initFx();
        // 使用 FxUtil 获取英雄和敌人的属性数据
        const seerUtil = FxUtil.getInstance();
        const heroData = seerUtil.getInstanceDataByNameAndOccuAndLevel("主角1", 1, hero.level);
        const enemyData = seerUtil.getInstanceDataByNameAndOccuAndLevel("怪物1", 1, enemy.level);

        // 更新 hero 和 enemy 的属性
        hero.attack = heroData.attack;
        hero.defense = heroData.defense;
        hero.maxHp = heroData.hp;
        hero.currentHp = heroData.hp;

        enemy.attack = enemyData.attack;
        enemy.defense = enemyData.defense;
        enemy.maxHp = enemyData.hp;
        enemy.currentHp = enemyData.hp;

        // 初始化血量显示
        this.characterView.updateHp(hero.currentHp, hero.maxHp, 'hero');
        this.characterView.updateHp(enemy.currentHp, enemy.maxHp, 'enemy');

        // 初始化图表 - 显示回合图表容器
        const detailContainer = document.getElementById('detailChartsContainer');
        if (detailContainer) detailContainer.style.display = 'block';

        while (round < maxRounds) {
            // Check if should stop
            if (this.shouldStop) {
                console.log('Battle animation stopped by user');
                break;
            }

            round++;
            
            // 英雄攻击 - 计算基础伤害（带随机性）
            const heroBaseDamage = Math.floor(hero.attack * (0.8 + Math.random() * 0.4));
            const actualHeroDamage = enemy.takeDamage(heroBaseDamage);
            
            // 播放攻击动画
            await this.characterView.playAttackAnimation('hero');
            if (this.shouldStop) break;
            await this.characterView.playHitAnimation('enemy', actualHeroDamage);
            if (this.shouldStop) break;
            
            // 更新血量
            this.characterView.updateHp(enemy.currentHp, enemy.maxHp, 'enemy');
            
            await new Promise(r => setTimeout(r, 200)); // 短暂延迟
            if (this.shouldStop) break;
            
            if (!enemy.isAlive()) {
                battleData.push({
                    round,
                    heroHp: hero.currentHp,
                    heroHpPercent: (hero.currentHp / hero.maxHp) * 100,
                    enemyHp: 0,
                    enemyHpPercent: 0,
                    heroDamageDealt: actualHeroDamage,
                    enemyDamageDealt: 0,
                    winner: hero.name,
                    battleEnd: true
                });
                // 立即更新图表（战斗结束）
                if (this.chartUpdateTimer !== null) {
                    clearTimeout(this.chartUpdateTimer);
                    this.chartUpdateTimer = null;
                }
                this.chartController.updateChartsWithBattleRounds(
                    battleData, 
                    'Hero', 
                    'Enemy Boss'
                );
                this.characterView.playVictoryAnimation('hero');
                break;
            }

            // 敌人攻击 - 计算基础伤害（带随机性）
            const enemyBaseDamage = Math.floor(enemy.attack * (0.8 + Math.random() * 0.4));
            const actualEnemyDamage = hero.takeDamage(enemyBaseDamage);
            
            // 播放攻击动画
            await this.characterView.playAttackAnimation('enemy');
            if (this.shouldStop) break;
            await this.characterView.playHitAnimation('hero', actualEnemyDamage);
            if (this.shouldStop) break;
            
            // 更新血量
            this.characterView.updateHp(hero.currentHp, hero.maxHp, 'hero');
            
            await new Promise(r => setTimeout(r, 200)); // 短暂延迟
            if (this.shouldStop) break;
            
            if (!hero.isAlive()) {
                battleData.push({
                    round,
                    heroHp: 0,
                    heroHpPercent: 0,
                    enemyHp: enemy.currentHp,
                    enemyHpPercent: (enemy.currentHp / enemy.maxHp) * 100,
                    heroDamageDealt: actualHeroDamage,
                    enemyDamageDealt: actualEnemyDamage,
                    winner: enemy.name,
                    battleEnd: true
                });
                // 立即更新图表（战斗结束）
                if (this.chartUpdateTimer !== null) {
                    clearTimeout(this.chartUpdateTimer);
                    this.chartUpdateTimer = null;
                }
                this.chartController.updateChartsWithBattleRounds(
                    battleData, 
                    'Hero', 
                    'Enemy Boss'
                );
                this.characterView.playVictoryAnimation('enemy');
                break;
            }

            // 记录回合数据
            battleData.push({
                round,
                heroHp: hero.currentHp,
                heroHpPercent: (hero.currentHp / hero.maxHp) * 100,
                enemyHp: enemy.currentHp,
                enemyHpPercent: (enemy.currentHp / enemy.maxHp) * 100,
                heroDamageDealt: actualHeroDamage,
                enemyDamageDealt: actualEnemyDamage,
                battleEnd: false
            });

            // 使用节流更新图表，避免过于频繁的更新
            if (this.chartUpdateTimer !== null) {
                clearTimeout(this.chartUpdateTimer);
            }
            this.chartUpdateTimer = window.setTimeout(() => {
                this.chartController.updateChartsWithBattleRounds(
                    battleData, 
                    'Hero', 
                    'Enemy Boss'
                );
                this.chartUpdateTimer = null;
            }, 50); // 50ms 节流，确保动画流畅
        }

        // 清理定时器
        if (this.chartUpdateTimer !== null) {
            clearTimeout(this.chartUpdateTimer);
            this.chartUpdateTimer = null;
        }

        const winner = hero.isAlive() ? hero.name : (enemy.isAlive() ? enemy.name : '平局');
        
        return {
            winner,
            rounds: round,
            battleData
        };
    }

    /**
     * 显示自定义战斗的详情图表（不更新主图表）
     */
    private showCustomBattleDetail(battle: any) {
        if (!battle.battleData || battle.battleData.length === 0) {
            console.error('No detailed battle data available');
            return;
        }

        this.currentLevel = battle.level;

        // 显示详情图表容器
        const detailContainer = document.getElementById('detailChartsContainer');
        if (detailContainer) detailContainer.style.display = 'block';

        // 创建详情图表
        this.chartController.createDetailCharts(battle.battleData, battle.heroName || 'Hero', battle.enemyName || 'Enemy');

        // 更新输出（如果不是批量模拟）
        const outputEl = document.getElementById('output');
        if (outputEl && !outputEl.textContent?.includes('────')) {
            outputEl.textContent = '';
            
            const details = `
${i18n.t('status.battleDetails.header', { level: battle.level })}
${i18n.t('status.battleDetails.duration', { rounds: battle.rounds })}
${i18n.t('status.battleDetails.hp', { hp: Math.round(battle.hp) })}
${i18n.t('status.battleDetails.damage', { damage: Math.round(battle.damage) })}
${i18n.t('status.battleDetails.footer')}
`;
            outputEl.textContent = details;
        }
    }

    private async showPVEGrowthCurve(maxLevel: number, startLevel: number = 1) {
        this.currentLevel = null;
        const detailContainer = document.getElementById('detailChartsContainer');
        if (detailContainer) detailContainer.style.display = 'none';

        // Use the imported generatePVEDataRange logic via our wrapper
        const { generatePVEDataRange } = await import('../core/SimulationService');

        const pveData = await generatePVEDataRange((data, level, total) => {
            this.chartController.updateCharts(data, this.currentLevel);
            this.pveBattleData = data;
            
            const percent = Math.round(level/total*100);
            this.setStatus('loading', i18n.t('status.simulating', { 
                current: level, 
                total: total,
                percent: percent
            }));

            // Auto-select first level when ready
            if (level === startLevel && data.length > 0) {
                setTimeout(() => {
                    if (data[0] && data[0].battleData) {
                        this.showBattleDetail(0);
                    }
                }, 500);
            }
        }, maxLevel - startLevel + 1, startLevel, () => this.shouldStop); // count, startLevel, shouldStop callback

        this.pveBattleData = pveData;
        console.log(`Growth curve generated with ${pveData.length} data points`);
    }

    private showBattleDetail(index: number) {
        if (!this.pveBattleData || !this.pveBattleData[index]) {
            console.error('Battle data not found for index:', index);
            return;
        }

        const battle = this.pveBattleData[index];
        
        if (!battle.battleData || battle.battleData.length === 0) {
            console.error('No detailed battle data available');
            return;
        }

        this.currentLevel = battle.level;
        this.chartController.updateCharts(this.pveBattleData, this.currentLevel);

        const detailContainer = document.getElementById('detailChartsContainer');
        if (detailContainer) detailContainer.style.display = 'block';

        this.chartController.createDetailCharts(battle.battleData, battle.heroName || 'Hero', battle.enemyName || 'Enemy');

        // Update output
        const outputEl = document.getElementById('output');
        if (outputEl) {
            outputEl.textContent = '';
            
            const details = `
${i18n.t('status.battleDetails.header', { level: battle.level })}
${i18n.t('status.battleDetails.duration', { rounds: battle.rounds })}
${i18n.t('status.battleDetails.hp', { hp: Math.round(battle.hp) })}
${i18n.t('status.battleDetails.damage', { damage: Math.round(battle.damage) })}
${i18n.t('status.battleDetails.footer')}
`;
            outputEl.textContent = details;
        }
    }

    private setStatus(type: string, message: string) {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.className = `status ${type}`;
            statusEl.textContent = message;
        }
    }

    private clearOutput() {
        const outputEl = document.getElementById('output');
        if (outputEl) {
            outputEl.textContent = '';
            // Reset placeholder via i18n
            outputEl.setAttribute('data-placeholder', i18n.t('charts.details.waiting'));
        }
        this.setStatus('', '');
    }
}
