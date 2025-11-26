/**
 * 战斗日志类 - 负责记录战斗过程中的所有日志和数据
 */
export class BattleLogger {
    private logs: string[] = [];
    private battleData: any[] = [];

    /**
     * 添加日志信息
     * @param message 日志消息
     */
    addLog(message: string) {
        const timestamp = new Date().toLocaleTimeString('zh-CN');
        const logMessage = `[${timestamp}] ${message}`;
        this.logs.push(logMessage);
        console.log(logMessage);
    }

    /**
     * 记录回合数据
     * @param round 回合数
     * @param data 回合数据
     */
    addRoundData(round: number, data: any) {
        this.battleData.push({
            round,
            timestamp: new Date().toISOString(),
            ...data
        });
    }

    /**
     * 获取所有日志
     */
    getLogs(): string[] {
        return [...this.logs];
    }

    /**
     * 获取战斗数据
     */
    getBattleData(): any[] {
        return [...this.battleData];
    }

    /**
     * 清空日志
     */
    clear() {
        this.logs = [];
        this.battleData = [];
    }

    /**
     * 生成战斗报告
     */
    generateReport(): string {
        let report = '\n========== 战斗报告 ==========\n';
        report += this.logs.join('\n');
        report += '\n\n========== 战斗数据统计 ==========\n';
        report += JSON.stringify(this.battleData, null, 2);
        report += '\n================================\n';
        return report;
    }
}
