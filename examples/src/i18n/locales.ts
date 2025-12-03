export const en = {
  meta: {
    title: "SoonFx Engine - Interactive Battle Demo",
  },
  header: {
    title: "⚔️ Interactive Battle Simulation",
    subtitle: "Real-time combat data visualization and analysis powered by SoonFx Engine",
    langSwitch: "中文"
  },
  scenarios: {
    title: "🎮 Battle Scenarios",
    pve: {
      label: "📈 Level Progression (1-50)",
      desc: "Watch how stats scale across levels"
    },
    newbie: {
      label: "🌱 Newbie Village (Lv 1-10)",
      desc: "First steps in the adventure"
    },
    midgame: {
      label: "⚔️ Mid-Game Challenge (Lv 20-30)",
      desc: "Intermediate difficulty battles"
    },
    custom: {
      label: "🔧 Custom Simulation",
      desc: "Adjust stats and fight!"
    },
    tip: {
      label: "💡 Tip:",
      text: "Click on any data point in the charts to see detailed battle information for that level."
    }
  },
  charts: {
    hpByLevel: "❤️ Health Points (HP) by Level",
    damageByLevel: "💥 Attack Damage by Level",
    roundsByLevel: "⏱️ Battle Duration (Rounds) by Level",
    hpByRound: "❤️ Health Points (HP) by Round",
    damageByRound: "💥 Damage by Round",
    loading: "Running simulations...",
    details: {
      title: "📋 Battle Details",
      hpChange: "HP Change Over Rounds",
      damageStats: "Damage Statistics",
      waiting: "Waiting for simulation..."
    }
  },
  story: {
    pveGrowth: {
      title: "📊 Level Progression Analysis",
      desc: "Simulating 50 battles to show how character stats evolve from novice to master..."
    },
    newbie: {
      title: "🌱 The First Adventure",
      desc: "A young hero takes their first steps, facing level 1-10 slimes in the Newbie Village..."
    },
    midGame: {
      title: "⚔️ Rising Challenge",
      desc: "The hero has grown stronger (Lv 20-30) and now faces tougher enemies in the Dark Forest..."
    },
    custom: {
      title: "🔧 Custom Battle Simulation",
      desc: "Manually configure hero and enemy attributes to test specific combat scenarios."
    }
  },
  custom: {
    title: "⚙️ Battle Configuration",
    start: "Start Battle",
    stop: "Stop Battle",
    running: "Fighting...",
    simCount: "Simulations:",
    hero: "🦸 Hero",
    enemy: "👹 Enemy",
    level: "Level",
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    presets: {
      balanced: "⚖️ Balanced",
      heroStrong: "💪 Strong Hero",
      enemyStrong: "👹 Strong Enemy",
      tank: "🛡️ Tank Build",
      glass: "🗡️ Glass Cannon"
    },
    report: {
      title: "📊 Batch Simulation Report ({count} runs)",
      winRate: "Win Rate: {rate}%",
      avgRounds: "Avg Rounds: {rounds}",
      avgHeroHp: "Avg Hero Remaining HP: {hp}",
      losses: "Losses: {count}",
      minRounds: "Min Rounds: {rounds}",
      maxRounds: "Max Rounds: {rounds}"
    }
  },
  status: {
    running: "🔄 Running {scenario} simulation...",
    simulating: "🔄 Simulating battles... {current}/{total} ({percent}%)",
    stopping: "⏹️ Stopping battle...",
    stopped: "⏹️ Battle stopped",
    success: "✅ Simulation complete! Click on any chart point to see detailed battle data.",
    error: "❌ Simulation failed: {message}",
    cannotModifyLevel: "⚠️ Cannot modify level during battle!",
    battleDetails: {
      header: "========== Level {level} Battle Details ==========",
      duration: "Battle Duration: {rounds} rounds",
      hp: "Hero Final HP: {hp}",
      damage: "Average Damage: {damage}",
      footer: "========================================"
    }
  }
};

export const zhCN = {
  meta: {
    title: "SoonFx 引擎 - 交互式战斗演示",
  },
  header: {
    title: "⚔️ 交互式战斗模拟",
    subtitle: "基于 SoonFx 引擎的实时战斗数据可视化与分析",
    langSwitch: "English"
  },
  scenarios: {
    title: "🎮 战斗场景",
    pve: {
      label: "📈 等级成长 (1-50)",
      desc: "观察属性如何随等级提升而变化"
    },
    newbie: {
      label: "🌱 新手村 (Lv 1-10)",
      desc: "冒险旅程的第一步"
    },
    midgame: {
      label: "⚔️ 中期挑战 (Lv 20-30)",
      desc: "面对更强大的敌人"
    },
    custom: {
      label: "🔧 自定义模拟",
      desc: "调整属性并战斗！"
    },
    tip: {
      label: "💡 提示:",
      text: "点击图表中的任意数据点查看该等级的详细战斗信息。"
    }
  },
  charts: {
    hpByLevel: "❤️ 生命值 (HP) 随等级变化",
    damageByLevel: "💥 攻击伤害随等级变化",
    roundsByLevel: "⏱️ 战斗回合数随等级变化",
    hpByRound: "❤️ 生命值 (HP) 随回合变化",
    damageByRound: "💥 伤害随回合变化",
    loading: "正在运行模拟...",
    details: {
      title: "📋 战斗详情",
      hpChange: "回合生命值变化",
      damageStats: "伤害统计",
      waiting: "等待模拟..."
    }
  },
  story: {
    pveGrowth: {
      title: "📊 等级成长分析",
      desc: "模拟 50 场战斗，展示角色属性如何从新手成长为大师..."
    },
    newbie: {
      title: "🌱 初次冒险",
      desc: "年轻的英雄迈出了第一步，在新手村面对 1-10 级的史莱姆..."
    },
    midGame: {
      title: "⚔️ 挑战升级",
      desc: "英雄变强了 (Lv 20-30)，现在要在黑暗森林中面对更棘手的敌人..."
    },
    custom: {
      title: "🔧 自定义战斗模拟",
      desc: "手动配置英雄和敌人的属性以测试特定的战斗场景。"
    }
  },
  custom: {
    title: "⚙️ 战斗配置",
    start: "开始战斗",
    stop: "停止战斗",
    running: "战斗中...",
    simCount: "模拟次数:",
    hero: "🦸 英雄",
    enemy: "👹 敌人",
    level: "等级",
    hp: "生命值",
    attack: "攻击力",
    defense: "防御力",
    presets: {
      balanced: "⚖️ 平衡",
      heroStrong: "💪 英雄强",
      enemyStrong: "👹 敌人强",
      tank: "🛡️ 坦克型",
      glass: "🗡️ 玻璃炮"
    },
    report: {
      title: "📊 批量模拟报告 (运行 {count} 次)",
      winRate: "胜率: {rate}%",
      avgRounds: "平均回合: {rounds}",
      avgHeroHp: "平均英雄剩余HP: {hp}",
      losses: "失败次数: {count}",
      minRounds: "最少回合: {rounds}",
      maxRounds: "最多回合: {rounds}"
    }
  },
  status: {
    running: "🔄 正在运行 {scenario} 模拟...",
    simulating: "🔄 正在模拟战斗... {current}/{total} ({percent}%)",
    stopping: "⏹️ 正在停止战斗...",
    stopped: "⏹️ 战斗已停止",
    success: "✅ 模拟完成！点击图表上的任意点查看详细战斗数据。",
    error: "❌ 模拟失败: {message}",
    cannotModifyLevel: "⚠️ 战斗中不能修改等级！",
    battleDetails: {
      header: "========== 等级 {level} 战斗详情 ==========",
      duration: "战斗持续: {rounds} 回合",
      hp: "英雄最终 HP: {hp}",
      damage: "平均伤害: {damage}",
      footer: "========================================"
    }
  }
};

