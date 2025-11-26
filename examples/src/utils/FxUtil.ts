import { Player, Eve, ChartsLayer, FXCentre, BillboardLayer, fx, Call } from "@soonfx/engine";

/**
 * Fx系统工具类 - 单例模式
 * 用于管理游戏中的角色数据、敌人数据以及配置信息
 * 提供创建玩家/敌人实例、数据更新、等级职业变更等功能
 */
export default class FxUtil {
    private static _instance: FxUtil;

    /** Fx配置数据 */
    private _fxData: any;
    /** Fx玩家实例 */
    private _fxPlayer: any;
    /** 玩家列表 */
    private playerList: Player[] = [];

    /**
     * 获取单例实例
     * @returns {FxUtil} FxUtil实例
     */
    public static getInstance(): FxUtil {
        if (!this._instance) {
            this._instance = new FxUtil();
        }
        return this._instance;
    }

    /**
     * 获取玩家实例
     * 从配置数据中创建一个新的玩家实例，设置基础属性和参数
     * @returns {any} 配置好的玩家实例
     */
    public getPlayerInstance() {
        // 获取第一个角色的数据配置
        let itemData = this._fxData[0];

        // 创建新的玩家实例
        let player = new Player();

        // 设置玩家名称 
        player.name = itemData.name;
        console.log(player.name);

        // 获取并打印玩家看板信息
        let billboard = player.getBillboard();
        console.log(billboard);

        // 设置玩家参数信息数组 
        player.parameterInfoArray = itemData.parameterInfoArray;
 

        return player;
    }

    /**
     * 根据敌人ID获取敌人实例
     * @param {number} enemyId - 敌人ID
     * @returns {any} 配置好的敌人实例
     */
    public getEnemyInstance(enemyId: number) {
        // 根据ID获取敌人数据配置
        let itemData = this._fxData[enemyId];

        // 创建新的敌人实例（使用玩家类）
        let player = new Player();

        // 设置敌人名称
        //
        player.name = itemData.name;
 

        // 设置敌人参数信息数组
        //
        player.parameterInfoArray = itemData.parameterInfoArray;
 

        return player;
    }

    /**
     * 根据角色名称获取实例
     * 通过角色名称查找对应的配置数据，创建并返回配置好的实例
     * @param {string} name - 角色名称
     * @returns {any} 配置好的角色实例，如果未找到则返回null
     */
    public getInstanceByName(name: string): Player | null {
        // 根据名称查找对应的配置数据
        let itemData = this._fxData.find((data: any) => data.name === name);

        if (!itemData) {
            console.warn(`未找到名称为 "${name}" 的角色配置`);
            return null;
        }

        // 创建新的角色实例
        let player = new Player();

        // 设置角色名称
        //
        player.name = itemData.name;
        //
        // console.log(`创建角色实例: ${player.name}`);

        // 获取看板信息
        // let billboard = player.getBillboard();
        // console.log(billboard);

        // 设置角色参数信息数组
        //
        player.parameterInfoArray = itemData.parameterInfoArray;
 
 

        return player;
    }
 

    /**
     * 加载配置数据
     * 初始化Fx系统，解析配置数据，创建玩家列表
     * @param {any} myData - 配置数据
     */
    loadConfig(myData: any) {
        // 初始化Fx中心
        new FXCentre();

        // 解析JSON配置数据
        var json = myData;
        var jsonData = typeof json === 'string' ? JSON.parse(json) : json;
        var stageData = jsonData.stage.operationArray;
        var libraryData = jsonData.library.operationArray;

        // 创建库体数据
        // fx.editBody = null;
        // fx.selectBody = null;
        fx.createLibraryBody(libraryData, true);


        // 初始化玩家相关数据
        this._fxPlayer = Player;
        this.playerList = [];

        // 创建调用中心，处理事件
        //
        let callCenter = new fx.CallCenter();

        // 监听添加看板事件
        callCenter.addEventListener(Eve.SHIFT_ADD_BOARD, (data: any) => {
            let _billboardLayer = new BillboardLayer(data.name);
            _billboardLayer.monitored = data.monitored;

            let billboardLayer = _billboardLayer;
            //
            // billboardLayer.absoluteAddress = data.site;

            // 处理操作数组
            for (var n = 0; n < data.operationArray.length; n++) {
                var bodyArray: any[] = [];
                fx.getLibraryBody(
                    bodyArray,
                    fx.targetFolder.tree,
                    data.operationArray[n].site,
                );
                fx.clickBody = bodyArray[0];
                billboardLayer.pushOperationLayer();
                fx.clickBody = null;
            }

            // 处理元数据数组
            for (var n = 0; n < data.metadataArray.length; n++) {
                var bodyArray: any[] = [];
                fx.getLibraryBody(
                    bodyArray,
                    fx.targetFolder.tree,
                    data.metadataArray[n].site,
                );
                fx.clickBody = bodyArray[0];

                // console.log(e === billboardLayer);
                let meta = data.metadataArray[n];
                billboardLayer.pushMetadata(
                    meta.componentType,
                    meta.componentMinValue,
                    meta.componentMaxValue,
                    meta.componentIntervalValue,
                );
                fx.clickBody = null;
            }

            // 发送数据库添加事件
            //
            fx.Call.send(fx.Eve.ADD_DATABASE_DATA, [
                billboardLayer,
                fx.selectBody,
                data.index,
            ]);

            // 发送刷新库坐标事件
            //
            fx.Call.send(fx.Eve.SHIFT_REFRESH_LIBRARY_COORDINATES, [
                billboardLayer,
                fx.selectBody,
            ]);
        });

        // 监听添加图表事件
        callCenter.addEventListener(Eve.SHIFT_ADD_CHARTS, (data: any) => {
            var chartsLayer = new ChartsLayer(data.name);
            let e = chartsLayer;
            //
            // e.absoluteAddress = data.site;

            // 处理操作层
            for (var n = 0; n < data.operationlayer.length; n++) {
                var bodyArray: any[] = [];

                fx.getLibraryBody(
                    bodyArray,
                    fx.targetFolder.tree,
                    data.operationlayer[n],
                );

                e.operationArray.push(bodyArray[0].copy());
            }
            var bodyArray: any[] = [];

            // 设置图表参数
            e.minValue = data.minValue;
            e.intervalValue = data.intervalValue;
            e.maxValue = data.maxValue;

            // 处理元数据
            if (!data.metadataArray) data.metadataArray = [];
            if (data.metadata) {
                data.metadataArray = [
                    {
                        site: data.metadata,
                        intervalValue: e.intervalValue,
                        minValue: e.minValue,
                    },
                ];
                data.metadata = null;
            }

            // 处理元数据数组
            for (var n = 0; n < data.metadataArray.length; n++) {
                var bodyArray: any[] = [];
                var info = data.metadataArray[n];
                fx.getLibraryBody(bodyArray, fx.targetFolder.tree, info.site);
                var copyItem = bodyArray[0].copy();
                copyItem.intervalValue = info.intervalValue || 1;
                copyItem.minValue = info.minValue || 1;
                e.metadataArray.push(copyItem);
                e.metadata = copyItem;
            }

            // 发送数据库添加事件
            //
            Call.send(fx.Eve.ADD_DATABASE_DATA, [
                e,
                fx.selectBody,
                data.index,
            ]);

            // 发送刷新库坐标事件
            //
            fx.Call.send(fx.Eve.SHIFT_REFRESH_LIBRARY_COORDINATES, [
                e,
                fx.selectBody,
            ]);
            fx.clickBody = null;
        });

        // 解析库体数据
        fx.parseLibraryBody(libraryData, true);
        fx.recursionSyncBody(fx.targetFolder.tree);

        // 处理实体数据，创建玩家列表
        // fx.editBody = null;
        // fx.selectBody = null;
        // fx.targetStoragePool = fx.stageStoragePool
        let array = jsonData.entity.operationArray;

        // 先保存配置数据，为创建实例做准备
        this._fxData = array;

        // 调用封装的方法创建玩家实例列表
        let playerList = this.createPlayersFromEntityArray(array);

        // 打印所有玩家的基础属性
        console.log('-------------------');
        playerList.forEach((player) => {

            let attack = player.getFormula('攻击');
            let hp = player.getFormula('生命');
            let defense = player.getFormula('防御');
            console.log('name', player.name);
            console.log('attack', attack);
            console.log('hp', hp);
            console.log('defense', defense);
        });

        // 设置玩家相关实例
        // this._fxPlayer = playerList[0];
        this.playerList = playerList;
    }

    /**
     * 根据职业和等级获取数据
     * @param {number} occu - 职业类型
     * @param {number} level - 等级
     * @returns {object} 包含攻击力、生命值、防御力的对象
     */
    public getDataByOccuAndLevel(occu: number, level: number) {
        // 更改玩家等级和职业
        // this.changePlayerLevelAndOccu(this._fxPlayer, level, occu);
        this._fxPlayer.changePlayerLevelAndOccupation(level, occu);
        // 获取玩家属性
        let attack = this._fxPlayer.getFormula('攻击1');
        let hp = this._fxPlayer.getFormula('生命');
        let defense = this._fxPlayer.getFormula('防御');

        return { attack, hp, defense };
    }
 
    /**
     * 根据名称、职业和等级获取实例数据
     * @param {string} name - 玩家名称
     * @param {number} occu - 职业类型
     * @param {number} level - 等级
     * @returns {object} 包含攻击力、生命值、防御力的对象
     */
    public getInstanceDataByNameAndOccuAndLevel(name: string, occu: number, level: number) {
        // 根据名称查找玩家
        let player = this.playerList.find(p => p.name === name);

        if (!player) {
            throw new Error(`未找到名称为 "${name}" 的玩家`);
        }

        // 更改玩家等级和职业
        // this.changePlayerLevelAndOccu(player, level, occu);
        player.changeLevelAndOccupation(level, occu);

        // 获取玩家属性
        let attack = player.getFormula('攻击');
        let hp = player.getFormula('生命');
        let defense = player.getFormula('防御');

        return { attack, hp, defense };
    }

    /**
     * 根据实体数组创建玩家实例列表
     * 遍历实体数组，为每个实体调用getInstanceByName创建对应的玩家实例
     * @param {any[]} entityArray - 实体配置数组
     * @returns {Player[]} 创建的玩家实例数组
     */
    private createPlayersFromEntityArray(entityArray: any[]): Player[] {
        let playerList = [];

        // 遍历实体数组，通过getInstanceByName创建玩家实例
        for (var i = 0; i < entityArray.length; i++) {
            let itemData = entityArray[i];

            // 使用getInstanceByName方法创建实例，复用创建逻辑
            let player = this.getInstanceByName(itemData.name);

            if (player) {

                playerList.push(player);
            } else {
                console.warn(`创建玩家实例失败: ${itemData.name}`);
            }
        }

        return playerList;
    }

    /**
     * 根据路径获取表格数据
     * 通过点分割的路径字符串，在目标文件夹树中查找对应的表格数据
     * @param {string} path - 点分割的路径字符串（如: "folder1.folder2.sheet"）
     * @returns {any} 表格的原始数据
     */
    public getSheetDataByPath(path: string) {
        // 将路径按点分割
        let paths = path.split('.');

        // 从目标文件夹开始查找
        let info: any = fx.targetFolder;
        let result: any;

        // 遍历路径的每一层
        for (let i = 0; i < paths.length; i++) {
            let temp: any;

            // 如果当前是文件夹，在其树结构中查找
            if (info.isFolder) {
                temp = info.tree.find((o: any) => o.name == paths[i]);
                if (!temp) {
                    throw new Error('getSheetDataByPath - 路径未找到: ' + paths[i]);
                }
            } else {
                // 如果不是文件夹，直接设置结果
                result = info;
            }

            info = temp;

            // 如果是最后一层，设置最终结果
            if (i == paths.length - 1) {
                result = info;
            }
        }

        // 返回表格的原始数据
        return result?.sheetData?.originData;

        // 注释掉的JSON解析代码
        let str = result?.sheetData?.originData; //?.sheets?.[0]?.data;
        let jsonData: any;
        try {
            jsonData = JSON.parse(str);
        } catch (e) {
            // JSON解析失败时的处理
        }

        return jsonData;
    }
}

 

(window as any).FxUtil = FxUtil
