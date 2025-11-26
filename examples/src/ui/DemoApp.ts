import { ChartController } from "./ChartController";
import { generatePVEData } from "../core/SimulationService";

interface StoryContent {
    title: string;
    desc: string;
}

const STORY_CONTENT: { [key: string]: StoryContent } = {
    'pve-growth': {
        title: '📊 Level Progression Analysis',
        desc: 'Simulating 50 battles to show how character stats evolve from novice to master...'
    },
    'newbie': {
        title: '🌱 The First Adventure',
        desc: 'A young hero takes their first steps, facing level 1-10 slimes in the Newbie Village...'
    },
    'mid-game': {
        title: '⚔️ Rising Challenge',
        desc: 'The hero has grown stronger (Lv 20-30) and now faces tougher enemies in the Dark Forest...'
    }
};

export class DemoApp {
    private chartController: ChartController;
    private currentScenario: string = 'pve-growth';
    private pveBattleData: any[] | null = null;
    private currentLevel: number | null = null;

    constructor() {
        this.chartController = new ChartController((index) => this.showBattleDetail(index));
    }

    public async init() {
        console.log('Battle simulation system initialized');
        this.bindEvents();
        this.redirectConsole();

        await this.chartController.initCharts();
        
        // Auto-run default scenario
        await this.selectScenario('pve-growth');
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
        const content = STORY_CONTENT[scenario];
        if (content) {
            const titleEl = document.getElementById('storyTitle');
            const descEl = document.getElementById('storyDesc');
            if (titleEl) titleEl.textContent = content.title;
            if (descEl) descEl.textContent = content.desc;
        }
    }

    public async selectScenario(scenario: string) {
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

        // Clear previous data
        this.clearOutput();
        this.chartController.clearCharts();

        // Show placeholders
        document.getElementById('hpPlaceholder')?.classList.remove('hidden');
        document.getElementById('damagePlaceholder')?.classList.remove('hidden');
        document.getElementById('roundsPlaceholder')?.classList.remove('hidden');

        // Run simulation
        await this.runScenario(scenario);
    }

    private async runScenario(scenario: string) {
        this.setStatus('loading', `🔄 Running ${scenario} simulation...`);

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

            this.setStatus('success', '✅ Simulation complete! Click on any chart point to see detailed battle data.');
        } catch (error: any) {
            console.error('Simulation error:', error);
            this.setStatus('error', '❌ Simulation failed: ' + error.message);
        }
    }

    private async showPVEGrowthCurve(maxLevel: number, startLevel: number = 1) {
        this.currentLevel = null;
        const detailContainer = document.getElementById('detailChartsContainer');
        if (detailContainer) detailContainer.style.display = 'none';

        // Use the imported generatePVEDataRange logic via our wrapper
        // Note: generatePVEData in index.html called generatePVEDataRange underneath
        // We'll implement a similar wrapper here or call SimulationService directly
        
        // We need a way to import generatePVEDataRange from where we put it. 
        // Assuming we put it in SimulationService.ts
        
        const { generatePVEDataRange } = await import('../core/SimulationService');

        const pveData = await generatePVEDataRange((data, level, total) => {
            this.chartController.updateCharts(data, this.currentLevel);
            this.pveBattleData = data;
            this.setStatus('loading', `🔄 Simulating battles... ${level}/${total} (${Math.round(level/total*100)}%)`);

            // Auto-select first level when ready
            if (level === startLevel && data.length > 0) {
                setTimeout(() => {
                    if (data[0] && data[0].battleData) {
                        this.showBattleDetail(0);
                    }
                }, 500);
            }
        }, maxLevel - startLevel + 1, startLevel); // count, startLevel

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
            // We can use a helper to append text if needed, but console.log redirection handles generic logs
            // Here we specificly want to show detail info
            const details = `
========== Level ${battle.level} Battle Details ==========
Battle Duration: ${battle.rounds} rounds
Hero Final HP: ${Math.round(battle.hp)}
Average Damage: ${Math.round(battle.damage)}
========================================
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
        if (outputEl) outputEl.textContent = '';
        this.setStatus('', '');
    }
}

