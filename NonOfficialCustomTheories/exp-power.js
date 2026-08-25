import { ConstantCost, ExponentialCost, FreeCost, CustomCost } from "./api/Costs"
import { BigNumber } from "./api/BigNumber"
import { theory, QuaternaryEntry } from "./api/Theory"
import { Utils } from "./api/Utils"
import { Localization } from "./api/Localization"
import { ui } from "./api/ui/UI"

/*

    ===== READ BEFORE GOING ANY FURTHER =====

    --- EXPONENTIAL POWER ---

    < credits >
    theory, idea, translations: HyperKNF
    testing: e^x community
    e_1, e_2, e_3, e_4, e_6 approximations: WolframAlpha.com (series expansion)
    e_5 approximation: Sequential Limits (official custom theory), Xelaroc

    < version >
    v1.3.3d TEST

    < downloads >
    https://theory.hyperknf.com/ExponentialPower.js
    https://raw.githubusercontent.com/hyperknf/ExponentialIdleCustomTheory/main/ExponentialPower.js

    < official leaderboards >
    https://docs.google.com/spreadsheets/d/1VlHgt1y4GWCDph3zPfsm2foX40NK5aM0IUfZlEgy_ac/

    < license >
    Permission to use, modify, merge, and distribute this piece of JavaScript code for non-profit-making
    purposes is hereby granted, provided that the correct credits (refer to the "credits" section of
    this code comment) are given.
    This JavaScript code is provided as is, without warranty of any kind, expressed or implied,
    including but not limited to the warranties of merchantability, fitness for a particular purpose,
    and non-infringement.
    Last updated: 29/11/2023 (EP v1.3.3d.test7)

*/

const TextResource = {
    "Achievements": {
        "Progress": {
            "Name": {
                "en": "Progress",
                "zh-Hant": "進度",
                "zh-Hans": "进度"
            },
            "e10": {
                "Name": {
                    "en": "Beginner",
                    "zh-Hant": "初階",
                    "zh-Hans": "初阶"
                },
                "Description": {
                    "en": "Reach e10ρ",
                    "zh-Hant": "達到e10ρ",
                    "zh-Hans": "达到e10ρ"
                }
            },
            "e25": {
                "Name": {
                    "en": "Novice",
                    "zh-Hant": "新手",
                    "zh-Hans": "新手"
                },
                "Description": {
                    "en": "Reach e25ρ",
                    "zh-Hant": "達到e25ρ",
                    "zh-Hans": "达到e25ρ"
                }
            },
            "e50": {
                "Name": {
                    "en": "Learner",
                    "zh-Hant": "學者",
                    "zh-Hans": "学者"
                },
                "Description": {
                    "en": "Reach e50ρ",
                    "zh-Hant": "達到e50ρ",
                    "zh-Hans": "达到e50ρ"
                }
            },
            "e100": {
                "Name": {
                    "en": "Amateur",
                    "zh-Hant": "業餘",
                    "zh-Hans": "业余"
                },
                "Description": {
                    "en": "Reach e100ρ",
                    "zh-Hant": "達到e100ρ",
                    "zh-Hans": "达到e100ρ"
                }
            },
            "e200": {
                "Name": {
                    "en": "Idler"
                },
                "Description": {
                    "en": "Reach e200ρ",
                    "zh-Hant": "達到e200ρ",
                    "zh-Hans": "达到e200ρ"
                }
            },
            "e500": {
                "Name": {
                    "en": "Professional"
                },
                "Description": {
                    "en": "Reach e500ρ",
                    "zh-Hant": "達到e500ρ",
                    "zh-Hans": "达到e500ρ"
                }
            },
            "e1000": {
                "Name": {
                    "en": "Exemplary"
                },
                "Description": {
                    "en": "Reach e1000ρ",
                    "zh-Hant": "達到e1000ρ",
                    "zh-Hans": "达到e1000ρ"
                }
            }
        },
        "Secret": {
            "Name": {
                "en": "Secret",
                "zh-Hant": "秘密",
                "zh-Hans": "秘密"
            },
            "Luck": {
                "Name": {
                    "en": "Luck",
                    "zh-Hant": "幸運",
                    "zh-Hans": "幸运"
                },
                "Description": {
                    "en": "You have a 1 in 1 million chance of getting this achievement per tick",
                    "zh-Hant": "在每一刻有一百萬分之一的機會獲得此成就",
                    "zh-Hans": "在每一刻有一百万分之一的机会获得此成就"
                },
                "Hint": {
                    "en": "Good luck",
                    "zh-Hant": "祝你好運",
                    "zh-Hans": "祝你好运",
                    "fi": "Onnea"
                }
            },
            "MilestoneUnlock": {
                "Name": {
                    "en": "Serious Hesitation",
                    "zh-Hant": "嚴重猶豫",
                    "zh-Hans": "严重犹豫",
                    "fi": "Vakava Epäröinti"
                },
                "Description": {
                    "en": "Reallocate Add Term milestone upgrade 10 times",
                    "zh-Hant": "重新分配第一個里程碑升級十次",
                    "zh-Hans": "重新分配第一个里程碑升级十次"
                },
                "Hint": {
                    "en": "Why would you do this?"
                }
            }
        }
    },
    "PublicationMultiplier": {
        "en": "Publication Multiplier",
        "zh-Hant": "出版物倍率",
        "zh-Hans": "出版物倍率",
        "fi": "Julkaisukerroin"
    },
    "TestUpgrade": {
        "en": "Free e3",
        "zh-Hant": "免費e3",
        "zh-Hans": "免费e3",
        "fi": "Ihmainen e3"
    },
    "Hour": {
        "en": "hour",
        "zh-Hant": "小時",
        "zh-Hans": "小时",
        "fi": "tunti",
        "de": "stunde"
    },
    "Second": {
        "en": "second",
        "zh-Hant": "秒",
        "zh-Hans": "秒",
        "fi": "sekuntia"
    },
    "DomainSwitch": {
        "Unlocked": {
            "Description": {
                "en": "Coming soon",
                "zh-Hant": "敬請期待",
                "zh-Hans": "敬请期待",
                "fi": "Tulossa pian"
            },
            "Info": {
                "en": "Coming soon",
                "zh-Hant": "敬請期待",
                "zh-Hans": "敬请期待",
                "fi": "Tulossa pian"
            }
        },
        "Locked": "?????"
    },
    "ResetStage": {
        "en": "You're about to reset your progress since the last publication. This will perform a publication if a publication is available.",
        "zh-Hant": "你將要重設你在此出版的進度，如果你能夠出版，此將會出版。",
        "zh-Hans": "你将要重设你在此出版的进度，如果你能够出版，此将会出版。",
        "fi": "Olet nollaamassa edistymistäsi edellisen julkaisun jälkeen. Tämä suorittaa julkaisun, jos julkaisu on saatavilla."
    },
    "Time": {
        "en": "Time",
        "zh-Hant": "時間",
        "zh-Hans": "时间",
        "fi": "Aika"
    },
    "TimeSincePublication": {
        "en": "Time since last publication",
        "zh-Hant": "自上次出版以來的時間",
        "zh-Hans": "自上次出版以外的时间",
        "fi": "Aika edellisestä julkaisusta"
    },
    "TimeSinceStarted": {
        "en": "Time since started",
        "zh-Hant": "自開始以來的時間",
        "zh-Hans": "自开始以来的时间",
        "fi": "Aika alkamisesta"
    },
    "RecoveryTime": {
        "en": "Last recovery time",
        "zh-Hant": "上次恢復所需的時間",
        "zh-Hans": "上次恢復所需的时间",
        "fi": "Viimeiseen palautukseen käytetty aika"
    },
    "Enable": {
        "en": "Enable",
        "zh-Hant": "啟動",
        "zh-Hans": "启动",
        "fi": "Käynnistä"
    },
    "Disable": {
        "en": "Disable",
        "zh-Hant": "關閉",
        "zh-Hans": "关闭",
        "fi": "Sammuta"
    },
    "Settings": {
        "Name": {
            "en": "Settings",
            "zh-Hant": "設置",
            "zh-Hans": "设置",
            "fi": "Asetukset"
        },
        "MaxDrhoDisplay": {
            "en": Utils.getMath(`\\max\\dot{\\rho}\\text{ display}`),
            "zh-Hant": Utils.getMath(`\\max\\dot{\\rho}\\text{顯示}`),
            "zh-Hans": Utils.getMath(`\\max\\dot{\\rho}\\text{显示}`),
            "fi": Utils.getMath(`\\max\\dot{\\rho}\\text{ näyttö}`)
        },
        "TimeDisplay": {
            "en": "Time display",
            "zh-Hant": "時間顯示",
            "zh-Hans": "时间显示",
            "fi": "Aikanäyttö"
        },
        "LockSettings": {
            "en": "Lock settings",
            "zh-Hant": "鎖定設置",
            "zh-Hans": "锁定设置",
            "fi": "Lukitse asetukset"
        }
    },
    "UnlockELatex": {
        "en": "e_i\\text{ max level}"
    },
    "Statistics": {
        "Title": {
            "en": "Statistics",
            "zh-Hant": "數據",
            "zh-Hans": "数据",
            "fi": "Tilastot"
        },
        "Show": {
            "en": "Show statistics",
            "zh-Hant": "顯示數據",
            "zh-Hans": "显示数据",
            "fi": "Näyttää tilastoja"
        }
    },
    "Lifetime": {
        "en": "Lifetime",
        "zh-Hant": "一直以來",
        "zh-Hans": "一直以来"
    },
    "Publication": {
        "en": "Publication",
        "zh-Hant": "此次出版",
        "zh-Hans": "此次出版"
    },
    "Ticks": {
        "en": "Ticks",
        "zh-Hant": "刻數",
        "zh-Hans": "刻数",
        "fi": "Tikki"
    },
    "Total": {
        "en": "Total",
        "zh-Hant": "總共",
        "zh-Hans": "总共",
        "fi": "Yhteensä"
    }
}

var id = "ExponentialPower_speedup"
var getName = language => {
    const names = {
        "en": "Exponential Power (speedup)",
        "zh-Hant": "指數力量",
        "zh-Hans": "指数力量",
        "fi": "Eksponentiaalinen Teho"
    }
    return names[language] ?? names.en
}
var getDescription = language => {
    const descriptions = {
        "en": [
            "Exponential Power by HyperKNF\nx3600 speedup mod by notrera",
            "",
            "Chinese Traditional, Chinese Simplified and Finnish are translated by HyperKNF"
        ],
        "zh-Hant": [
            "指數力量由HyperKNF設計",
            "",
            "繁體中文，簡體中文和芬蘭語由HyperKNF翻譯"
        ],
        "zh-Hans": [
            "指数力量由HyperKNF设计",
            "",
            "简体中文，简体中文和芬兰语由HyperKNF翻译"
        ],
        "fi": [
            "HyperKNF:stä Eksponentiaalinen Teho",
            "",
            "Perinteinen kiina, yksinkertaistettu kiina ja suomeksi kääntänyt HyperKNF"
        ]
    }
    return (descriptions[language] ?? descriptions.en).join("\n")
}
var authors = "HyperKNF\n(mod) notera"
var version = "v1.3.4d"

const currency2text = ["δ", "\\delta"]

var drho = BigNumber.ZERO

var currency, currency2
var k, c1, c2, n, a, b, x, y, l1, l2, p, x1, x2, y1, y2, dtime
var test_upgrade, domain_switch
var unlock, unlock2, increase_unlockE, time_exp, c1_exp
var publication, unlockE, unlockCurrency2
var ad_bonus = false

var dt = BigNumber.ONE / 10

var achievements = {
    regular: [
        false,
        false,
        false,
        false,
        false,
        false,
        false
    ],
    secret: [
        false,
        false
    ]
}

var progress_achievements, secret_achievements
var achievement1, achievement2, achievement3, achievement4, achievement5, achievement6, achievement7
var secret_achievement1, secret_achievement2

var page = 1
var E = BigNumber.E
var E1 = BigNumber.ZERO, E2 = BigNumber.ZERO, E3 = BigNumber.ZERO, E4 = BigNumber.ZERO, E5 = BigNumber.ZERO, E6 = BigNumber.ZERO
var EDisplay = [BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO]
var time = BigNumber.ZERO

var domain_switched = false
var domain = 1

var publication_max_drho = BigNumber.ZERO
var max_drho = BigNumber.ZERO
var total_rho = BigNumber.ZERO

var balance_values = [BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO]

var total_time = [BigNumber.ZERO, BigNumber.ZERO]
var ticks = BigNumber.ZERO
var recovering = false
var recovery_time = BigNumber.ZERO

var unlock_bought = false, unlock_refund = false, unlock_times = 0, tap_count = 0
var milestones = [20, 50, 100, 170, 290, 400, 450, 650, 720, 900, 925, 960, 1000]
var secret_achievement_chance = 1e6
var page2_equation_scale = 0.925

var settings = {
    display_overlay: {
        time: true,
        max_drho: true
    },
    lock_settings: false
}
var settings_upgrades = {
    display_overlay: {
        max_drho: null,
        time: null
    },
    lock_settings: null
}

var show_stats

var tertiary_display = Array.from({
    length: 2
}, () => BigNumber.ZERO)

var log = (base, value) => BigNumber.from(value).log() / BigNumber.from(base).log()
var getTextResource = resource => resource[Localization.language] ?? resource.en ?? "?????"

var getStepwisePowerProduct = (level, base, step_length, offset) => {
    if (offset != 0) throw new Error("I don't know how to implement non-zero offset :)")
    
    const step = Math.floor(level / step_length)
    const levels = level % step_length
    const exponents = Array.from({
        length: step
    }, () => step_length)
    exponents.push(levels)
    const product = exponents.reduce(
        (product, value, index) => {
            return product * BigNumber.from(base).pow(index + 1).pow(value)
        }, 1
    )
    return product
}

var formatNumber = (number, digits, idklol) => (!idklol ? (number < 10 ? "0" : "") : "") + BigNumber.from(number).toString(digits)

var formatTime = time => {
    let remaining_time = BigNumber.from(time).toNumber()
    const days = Math.floor(remaining_time / (60 * 60 * 24))
    remaining_time = remaining_time % (60 * 60 * 24)
    const hours = Math.floor(remaining_time / (60 * 60))
    remaining_time = remaining_time % (60 * 60)
    const minutes = Math.floor(remaining_time / 60)
    remaining_time = remaining_time % 60
    const seconds = remaining_time
    let result = [formatNumber(days, 0, true), formatNumber(hours, 0), formatNumber(minutes, 0), formatNumber(seconds, 1)]
    return result
}

var initialize = () => {
    currency = theory.createCurrency()
    currency2 = theory.createCurrency(...currency2text)

    ///////////////////
    // Regular Upgrades

    // k
    {
        let getDesc = (level) => "k=" + getK(level).toString(0)
        k = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(1.5))))
        k.getDescription = (_) => Utils.getMath(getDesc(k.level))
        k.getInfo = (amount) => Utils.getMathTo(getDesc(k.level), getDesc(k.level + amount))
    }

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(1)
        const getCost = level => 15 * getStepwisePowerProduct(level, 2, 50, 0)
        c1 = theory.createUpgrade(1, currency, new CustomCost(
            getCost,
            function cumulative_cost(level, amount) {
                let result = BigNumber.ZERO
                for (let i = 0; i < amount; i++) result += getCost(level + i)
                return result
            },
            function max(level, currency) {
                let cumulative = BigNumber.ZERO
                let current_level = level
                while (cumulative < currency) {
                    cumulative += getCost(current_level)
                    current_level++
                }
                return Math.round(current_level - level - 1)
            }
        ))
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level))
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount))
    }

    // c2
    {
        let getDesc = (level) => "c_2=" + getC2(level).toString(5)
        let getInfo = (level) => "c_2=" + getC2(level).toString(5)
        c2 = theory.createUpgrade(2, currency, new ExponentialCost(50, Math.log2(10)))
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level))
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount))
    }

    // x1
    {
        let getDesc = level => "x_1=" + getX1(level).toString(3)
        x1 = theory.createUpgrade(3, currency, new ExponentialCost(1e45, Math.log2(77.5)))
        x1.getDescription = _ => Utils.getMath(getDesc(x1.level))
        x1.getInfo = amount => Utils.getMathTo(getDesc(x1.level), getDesc(x1.level + amount))
    }

    // x2
    {
        let getDesc = level => "x_2=" + getX2(level).toString(3)
        x2 = theory.createUpgrade(4, currency, new SuperExponentialCost(BigNumber.TEN.pow(450), 60, 1.025).cost_model)
        x2.getDescription = _ => Utils.getMath(getDesc(x2.level))
        x2.getInfo = amount => Utils.getMathTo(getDesc(x2.level), getDesc(x2.level + amount))
    }
    
    // y1
    {
        let getInfo = level => "y_1=" + getY1(level).toString(3)
        let getDesc = level => "y_1=e^{" + getY1Exponent(level).toString(3) + "}"
        y1 = theory.createUpgrade(50, currency, new ExponentialCost(1e100, Math.log2(10)))
        y1.getDescription = _ => Utils.getMath(getDesc(y1.level))
        y1.getInfo = amount => Utils.getMathTo(getInfo(y1.level), getInfo(y1.level + amount))
    }

    // y2
    {
        let getInfo = level => "y_2=" + getY2(level).toString(3)
        let getDesc = level => "y_2=\\pi^{" + getY2Exponent(level).toString(1) + "}"
        y2 = theory.createUpgrade(51, currency, new ExponentialCost(1e170, Math.log2(20)))
        y2.getDescription = _ => Utils.getMath(getDesc(y2.level))
        y2.getInfo = amount => Utils.getMathTo(getInfo(y2.level), getInfo(y2.level + amount))
    }

    // n
    {
        let getDesc = (level) => "n=" + getN(level).toString(0)
        n = theory.createUpgrade(100, currency, new ExponentialCost(1e20, Math.log2(1.75)))
        n.getDescription = (_) => Utils.getMath(getDesc(n.level))
        n.getInfo = (amount) => Utils.getMathTo(getDesc(n.level), getDesc(n.level + amount))
    }

    // a
    {
        let getInfo = (level) => "a=" + getInverseEDisplay(getInverseA(level))
        let getDesc = level => "a=e^{" + (BigNumber.from(-0.05) * level).toString(2) + "}"
        a = theory.createUpgrade(101, currency, new ExponentialCost(1e31, Math.log2(2.37)))
        a.getDescription = (_) => Utils.getMath(getDesc(a.level))
        a.getInfo = (amount) => Utils.getMathTo(getInfo(a.level), getInfo(a.level + amount))
    }

    // b
    {
        let getDesc = (level) => "b=" + getB(level).toString(0)
        b = theory.createUpgrade(102, currency, new ExponentialCost(1e31, Math.log2(2.93125)))
        b.getDescription = (_) => Utils.getMath(getDesc(b.level))
        b.getInfo = (amount) => Utils.getMathTo(getDesc(b.level), getDesc(b.level + amount))
    }

    // x
    {
        let getDesc = (level) => "x=" + getX(level).toString(0)
        x = theory.createUpgrade(103, currency, new ExponentialCost(5e46, Math.log2(1.93)))
        x.getDescription = (_) => Utils.getMath(getDesc(x.level))
        x.getInfo = (amount) => Utils.getMathTo(getDesc(x.level), getDesc(x.level + amount))
    }

    // y
    {
        let getDesc = (level) => "y=" + getY(level).toString(2)
        let getInfo = (level) => "y=" + getY(level).toString(2)
        y = theory.createUpgrade(104, currency, new ExponentialCost(5e83, Math.log2(2.046375)))
        y.getDescription = (_) => Utils.getMath(getDesc(y.level))
        y.getInfo = (amount) => Utils.getMathTo(getInfo(y.level), getInfo(y.level + amount))
    }

    // l1
    {
        let getDesc = (level) => "l_1=" + getL1(level).toString(0)
        let getInfo = (level) => "l_1=" + getL1(level).toString(0)
        l1 = theory.createUpgrade(105, currency, new ExponentialCost(BigNumber.TEN.pow(650), Math.log2(6.2)))
        l1.getDescription = (_) => Utils.getMath(getDesc(l1.level))
        l1.getInfo = (amount) => Utils.getMathTo(getInfo(l1.level), getInfo(l1.level + amount))
    }

    // l2
    {
        let getDesc = (level) => "l_2=1.2^{" + getL2Exponent(level).toString(0) + "}"
        let getInfo = (level) => "l_2=" + getL2(level).toString(2)
        l2 = theory.createUpgrade(106, currency, new SuperExponentialCost(BigNumber.TEN.pow(650), 24.5, 1.001).cost_model)
        l2.getDescription = (_) => Utils.getMath(getDesc(l2.level))
        l2.getInfo = (amount) => Utils.getMathTo(getInfo(l2.level), getInfo(l2.level + amount))
    }

    // p
    {
        let getDesc = level => `p=${getP(level)}`
        p = theory.createUpgrade(107, currency, new SuperExponentialCost(BigNumber.TEN.pow(720), 3, 1.00125).cost_model)
        p.getDescription = _ => Utils.getMath(getDesc(p.level))
        p.getInfo = amount => Utils.getMathTo(getDesc(p.level), getDesc(p.level + amount))
    }

    // dt
    {
        let getDesc = (level) => "\\dot{t}=" + getDT(level).toString(1)
        dtime = theory.createUpgrade(999, currency, new CustomCost(
            level => {
                if (level == 0) return BigNumber.ZERO
                if (level <= 10) return BigNumber.TEN.pow(10).pow(level)
                if (level >= 10) return BigNumber.TEN.pow(1000) * BigNumber.TEN.pow(10).pow(level - 10)
            }
        ))
        dtime.getDescription = (_) => Utils.getMath(getDesc(dtime.level))
        dtime.getInfo = (amount) => Utils.getMathTo(getDesc(dtime.level), getDesc(dtime.level + amount))
        dtime.maxLevel = 10
    }

    /////////////////////
    // Permanent Upgrades
    publication = theory.createPublicationUpgrade(0, currency, 1e13)
    theory.createBuyAllUpgrade(1, currency, 1e16)
    theory.createAutoBuyerUpgrade(2, currency, 1e31)

    {
        let getDesc = level => Localization.getUpgradeUnlockDesc(`e_{${level + 1}}`)
        let getInfo = level => Localization.getUpgradeUnlockInfo(`e_{${level + 1}}`)
        unlockE = theory.createPermanentUpgrade(100, currency, new CustomCost(
            level => {
                switch (level) {
                    case 0:
                        return BigNumber.ZERO
                    case 1:
                        return BigNumber.TEN.pow(32)
                    case 2:
                        return BigNumber.TEN.pow(48)
                    case 3:
                        return BigNumber.TEN.pow(85)
                    case 4:
                        return BigNumber.TEN.pow(650)
                    case 5:
                        return BigNumber.TEN.pow(720)
                }
            }
        ))
        unlockE.getDescription = _ => getDesc(unlockE.level)
        unlockE.getInfo = _ => getInfo(unlockE.level)
        unlockE.maxLevel = 4
    }

    {
        let getDesc = _ => Localization.getUpgradeUnlockDesc(currency2text[1])
        let getInfo = _ => Localization.getUpgradeUnlockInfo(currency2text[1])
        unlockCurrency2 = theory.createPermanentUpgrade(1000, currency, new ConstantCost(BigNumber.TEN.pow(9999)))
        unlockCurrency2.description = "?????"
        unlockCurrency2.info = "?????"
        unlockCurrency2.maxLevel = 1
    }

    {
        let getDesc = level => `${
            getTextResource(settings.display_overlay.max_drho ? TextResource.Disable : TextResource.Enable)
        } ${getTextResource(TextResource.Settings.MaxDrhoDisplay)}`
        let getInfo = getDesc
        settings_upgrades.display_overlay.max_drho = theory.createPermanentUpgrade(10000, currency2, new FreeCost())
        settings_upgrades.display_overlay.max_drho.getDescription = level => getDesc(level)
        settings_upgrades.display_overlay.max_drho.getInfo = level => getInfo(level)
        settings_upgrades.display_overlay.max_drho.isAvailable = true
        settings_upgrades.display_overlay.max_drho.bought = _ => {
            settings_upgrades.display_overlay.max_drho.level = 0
            settings.display_overlay.max_drho = !settings.display_overlay.max_drho
        }
    }

    {
        let getDesc = level => `${
            getTextResource(settings.display_overlay.time ? TextResource.Disable : TextResource.Enable)
        } ${getTextResource(TextResource.Settings.TimeDisplay)}`
        let getInfo = getDesc
        settings_upgrades.display_overlay.time = theory.createPermanentUpgrade(10100, currency2, new FreeCost())
        settings_upgrades.display_overlay.time.getDescription = level => getDesc(level)
        settings_upgrades.display_overlay.time.getInfo = level => getInfo(level)
        settings_upgrades.display_overlay.time.isAvailable = true
        settings_upgrades.display_overlay.time.bought = _ => {
            settings_upgrades.display_overlay.time.level = 0
            settings.display_overlay.time = !settings.display_overlay.time
        }
    }

    {
        let getDesc = level => `${
            getTextResource(settings.lock_settings ? TextResource.Disable : TextResource.Enable)
        } ${getTextResource(TextResource.Settings.LockSettings)}`
        let getInfo = getDesc
        settings_upgrades.lock_settings = theory.createPermanentUpgrade(11000, currency2, new FreeCost())
        settings_upgrades.lock_settings.getDescription = level => getDesc(level)
        settings_upgrades.lock_settings.getInfo = level => getInfo(level)
        settings_upgrades.lock_settings.isAvailable = true
        settings_upgrades.lock_settings.bought = _ => {
            settings_upgrades.lock_settings.level = 0
            settings.lock_settings = !settings.lock_settings
        }
    }

    {
        let getDesc = level => getTextResource(TextResource.Statistics.Show)
        let getInfo = getDesc
        show_stats = theory.createPermanentUpgrade(20000, currency2, new FreeCost())
        show_stats.getDescription = level => getDesc(level)
        show_stats.getInfo = level => getInfo(level)
        show_stats.bought = _ => {
            show_stats.level = 0
            Popups.statistics.show()
        }
    }

    //////////////////////
    //// Singular Upgrades

    {
        domain_switch = theory.createSingularUpgrade(100, currency, new FreeCost())
        domain_switch.getDescription = _ => unlockCurrency2.level >= 1 ? getTextResource(TextResource.DomainSwitch.Unlocked.Description) : getTextResource(TextResource.DomainSwitch.Locked)
        domain_switch.getInfo = _ => unlockCurrency2 >= 1 ? getTextResource(TextResource.DomainSwitch.Unlocked.Info) : getTextResource(TextResource.DomainSwitch.Locked)
        domain_switch.bought = _ => {
            domain_switch.level = 0
            domain_switched = true
        }
    }

    /*
    {
        test_upgrade = theory.createSingularUpgrade(1000, currency, new FreeCost())
        test_upgrade.getDescription = test_upgrade.getInfo = _ => Utils.getMath(`\\text{${getTextResource(TextResource.TestUpgrade)}}`)
        test_upgrade.bought = _ => currency.value *= 1000
    }
    */

    ///////////////////////
    //// Milestone Upgrades

    theory.setMilestoneCost(new CustomCost(level => BigNumber.from(milestones[level] ?? 9999)))

    { 
        unlock = theory.createMilestoneUpgrade(0, 4)
        unlock.getDescription = _ => Localization.getUpgradeAddTermDesc(
            unlock.level == 0 ? "E" :
            unlock.level == 1 ? "x_1" :
            unlock.level == 2 ? "y_1" :
            "y_2"
        )
        unlock.getInfo = _ => Localization.getUpgradeAddTermInfo(
            unlock.level == 0 ? "E" :
            unlock.level == 1 ? "x_1" :
            unlock.level == 2 ? "y_1" :
            "y_2"
        )
        unlock.canBeRefunded = _ => (time_exp.level == 0 || unlock.level >= 2) && unlock2.level == 0
        unlock.bought = _ => unlock_bought = true
        unlock.refunded = _ => unlock_refund = true
    }

    { 
        unlock2 = theory.createMilestoneUpgrade(10, 1)
        unlock2.getDescription = _ => Localization.getUpgradeAddTermDesc("x_2")
        unlock2.getInfo = _ => Localization.getUpgradeAddTermInfo("x_2")
        unlock2.canBeRefunded = _ => increase_unlockE.level == 0
    }

    { 
        increase_unlockE = theory.createMilestoneUpgrade(50, 2)
        increase_unlockE.getDescription = _ => Localization.getUpgradeIncCustomDesc(getTextResource(TextResource.UnlockELatex), 1)
        increase_unlockE.getInfo = _ => Localization.getUpgradeIncCustomInfo(getTextResource(TextResource.UnlockELatex), 1)
        increase_unlockE.canBeRefunded = _ => c1_exp.level == 0
    }

    { 
        time_exp = theory.createMilestoneUpgrade(100, 2)
        time_exp.getDescription = _ => Localization.getUpgradeIncCustomExpDesc("t", 0.25)
        time_exp.getInfo = _ => Localization.getUpgradeIncCustomExpInfo("t", 0.25)
        time_exp.canBeRefunded = _ => unlock2.level == 0
    }

    { 
        c1_exp = theory.createMilestoneUpgrade(200, 4)
        c1_exp.getDescription = _ => Localization.getUpgradeIncCustomExpDesc("c_1", c1_exp.level >= 2 ? 0.02 : 0.03)
        c1_exp.getInfo = _ => Localization.getUpgradeIncCustomExpInfo("c_1", c1_exp.level >= 2 ? 0.02 : 0.03)
        c1_exp.canBeRefunded = _ => true
    }
    
    /////////////////
    //// Achievements

    progress_achievements = theory.createAchievementCategory(
        0,
        getTextResource(TextResource.Achievements.Progress.Name)
    )
    secret_achievements = theory.createAchievementCategory(
        999,
        getTextResource(TextResource.Achievements.Secret.Name)
    )
    
    achievement1 = theory.createAchievement(
        0,
        progress_achievements,
        getTextResource(TextResource.Achievements.Progress.e10.Name),
        getTextResource(TextResource.Achievements.Progress.e10.Description),
        () => achievements.regular[0]
    )
    achievement2 = theory.createAchievement(
        1,
        progress_achievements,
        getTextResource(TextResource.Achievements.Progress.e25.Name),
        getTextResource(TextResource.Achievements.Progress.e25.Description),
        () => achievements.regular[1]
    )
    achievement3 = theory.createAchievement(
        2,
        progress_achievements,
        getTextResource(TextResource.Achievements.Progress.e50.Name),
        getTextResource(TextResource.Achievements.Progress.e50.Description),
        () => achievements.regular[2]
    )
    achievement4 = theory.createAchievement(
        3,
        progress_achievements,
        getTextResource(TextResource.Achievements.Progress.e100.Name),
        getTextResource(TextResource.Achievements.Progress.e100.Description),
        () => achievements.regular[3]
    )
    achievement5 = theory.createAchievement(
        4,
        progress_achievements,
        getTextResource(TextResource.Achievements.Progress.e200.Name),
        getTextResource(TextResource.Achievements.Progress.e200.Description),
        () => achievements.regular[4]
    )
    achievement6 = theory.createAchievement(
        5,
        progress_achievements,
        getTextResource(TextResource.Achievements.Progress.e500.Name),
        getTextResource(TextResource.Achievements.Progress.e500.Description),
        () => achievements.regular[5]
    )
    achievement7 = theory.createAchievement(
        6,
        progress_achievements,
        getTextResource(TextResource.Achievements.Progress.e1000.Name),
        getTextResource(TextResource.Achievements.Progress.e1000.Description),
        () => achievements.regular[5]
    )

    secret_achievement1 = theory.createSecretAchievement(
        5000,
        secret_achievements,
        getTextResource(TextResource.Achievements.Secret.MilestoneUnlock.Name),
        getTextResource(TextResource.Achievements.Secret.MilestoneUnlock.Description),
        getTextResource(TextResource.Achievements.Secret.MilestoneUnlock.Hint),
        () => achievements.secret[0]
    )
    secret_achievement2 = theory.createSecretAchievement(
        99900,
        secret_achievements,
        getTextResource(TextResource.Achievements.Secret.Luck.Name),
        getTextResource(TextResource.Achievements.Secret.Luck.Description),
        getTextResource(TextResource.Achievements.Secret.Luck.Hint),
        () => achievements.secret[1]
    )
    
    ///////////////////
    //// Story chapters
    //chapter1 = theory.createStoryChapter(0, "My First Chapter", "This is line 1,\nand this is line 2.\n\nNice.", () => c1.level > 0)
    //chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => c2.level > 0)
}

var skip_time = seconds => {
    const ticks = Math.min(seconds / 0.1, 200)
    const time_per_tick = seconds / ticks
    const multi = ad_bonus ? 1.5 : 1
    const autobuy = theory.isAutoBuyerActive
    for (let ctick = 1; ctick <= ticks; ctick++) {
        if (autobuy) buy_all_upgrades()
        tick(time_per_tick, multi)
    }
}

var buy_all_upgrades = () => {
    const upgrades = [k, c1, c2, n, a, b, x, y, l1, l2, p, x1, x2, y1, y2, dtime]
    for (const upgrade of upgrades) if (upgrade && upgrade.isAutoBuyable) upgrade.buy(-1)
}

var updatePage = () => {
    if (unlock.level < 1 && page == 2) page = 1
}

var updateMaxLevel = () => {
    // Unlock e_i
    {
        const max_level = 4 + increase_unlockE.level
        if (unlockE.level > max_level) {
            for (let i = unlockE.level; i > max_level; i--) {
                unlockE.level--
                currency.value += unlockE.cost.getCost(unlockE.level)
            }
        }
        unlockE.maxLevel = max_level
    }
}

var updateAvailability = () => {
    // Upgrades

    n.isAvailable = unlock.level >= 1 && unlockE.level >= 1
    a.isAvailable = b.isAvailable = unlock.level >= 1 && unlockE.level >= 2
    x.isAvailable = unlock.level >= 1 && unlockE.level >= 3
    y.isAvailable = unlock.level >= 1 && unlockE.level >= 4
    l1.isAvailable = l2.isAvailable = unlockE.level >= 5
    p.isAvailable = unlockE.level >= 6

    x1.isAvailable = unlock.level >= 2
    x2.isAvailable = unlock2.level >= 1
    y1.isAvailable = unlock.level >= 3
    y2.isAvailable = unlock.level >= 4

    unlockE.isAvailable = unlock.level >= 1

    unlock2.isAvailable = unlock.level >= 4 && time_exp.level >= 2
    increase_unlockE.isAvailable = unlock2.level >= 1

    time_exp.isAvailable = unlock.level >= 1
    c1_exp.isAvailable = increase_unlockE.level == increase_unlockE.maxLevel

    // Permanent upgrades

    settings_upgrades.display_overlay.max_drho.isAvailable = !settings.lock_settings
    settings_upgrades.display_overlay.time.isAvailable = !settings.lock_settings

    // Singular upgrades

    // domain_switch.isAvailable = unlockCurrency2.level >= 1
}

var tick = (elapsedTime, multiplier) => {
    total_time[0] = total_time[0] + elapsedTime
    total_time[1] = total_time[1] + elapsedTime
    ticks += BigNumber.ONE
    
    dt = BigNumber.from(elapsedTime * multiplier * 3600) // x3600 speed
    if (multiplier == 1.5) ad_bonus = true
    const bonus = theory.publicationMultiplier

    E1 = EDisplay[0] = getE1(getN(n.level))
    if (unlockE.level >= 2) E2 = EDisplay[1] = getE2(getA(a.level), getB(b.level))
    if (unlockE.level >= 3) E3 = EDisplay[2] = getE3(getX(x.level))
    if (unlockE.level >= 4) E4 = EDisplay[3] = getE4(getY(y.level))
    if (unlockE.level >= 5) E5 = EDisplay[4] = getE5(getL1(l1.level), getL2(l2.level))
    if (unlockE.level >= 6) E6 = EDisplay[5] = getE6(getP(p.level))
    E = E1
    if (unlockE.level >= 2) E *= E2
    if (unlockE.level >= 3) E *= E3
    if (unlockE.level >= 4) E *= E4
    if (unlockE.level >= 5) E *= E5
    if (unlockE.level >= 6) E *= E6

    time += dt * getDT(dtime.level)
    const main_exponent = getC1(c1.level).pow(getC1ExtraExponent(c1_exp.level) * getC2Balance(getC2(c2.level)) * (
        unlock.level >= 2 ? getX1(x1.level) : 1
    ) * (
        unlock2.level >= 1 ? getX2(x2.level) : 1
    ))
    tertiary_display[0] = main_exponent.toString(3)
    drho = getK(k.level) * bonus * time.pow(getTExp(time_exp.level)) * (
        unlock.level >= 1 && unlockE.level >= 1 ? E.pow(0.9) : 1
    ) * main_exponent * (
        unlock.level >= 3 ? getY1(y1.level) : 1
    ) * (
        unlock.level >= 4 ? getY2(y2.level) : 1
    )
    currency.value += drho * dt
    total_rho += drho * dt
    total_rho = total_rho.max(getCurrencyFromTau(theory.tau)[0])

    if (max_drho <= drho * (dt / 0.1)) max_drho = drho * (dt / 0.1)
    if (publication_max_drho <= drho * (dt / 0.1)) publication_max_drho = drho * (dt / 0.1)

    if (currency.value >= BigNumber.TEN.pow(10)) achievements.regular[0] = true
    if (currency.value >= BigNumber.TEN.pow(25)) achievements.regular[1] = true
    if (currency.value >= BigNumber.TEN.pow(50)) achievements.regular[2] = true
    if (currency.value >= BigNumber.TEN.pow(100)) achievements.regular[3] = true
    if (currency.value >= BigNumber.TEN.pow(200)) achievements.regular[4] = true
    if (currency.value >= BigNumber.TEN.pow(500)) achievements.regular[5] = true
    if (currency.value >= BigNumber.TEN.pow(1000)) achievements.regular[6] = true

    if (unlock_bought && unlock_refund) {
        unlock_bought = unlock_refund = false
        unlock_times++
        if (unlock_times >= 10) achievements.secret[0] = true
    }
    if (Math.round(Math.random() * (secret_achievement_chance - 1) + 1) == 1) achievements.secret[1] = true

    const publication_rho = getCurrencyFromTau(theory.tau)[0]
    if (publication_rho <= currency.value && recovering) {
        recovering = false
        recovery_time = total_time[1]
    }

    theory.invalidatePrimaryEquation()
    theory.invalidateSecondaryEquation()
    theory.invalidateTertiaryEquation()
    theory.invalidateQuaternaryValues()

    updatePage()
    updateMaxLevel()
    updateAvailability()
}

var postPublish = () => {
    publication_max_drho = BigNumber.ZERO
    time = BigNumber.ZERO
    total_time[1] = BigNumber.ZERO
    recovering = true
    domain = 1
    page = 1
}

var formatQuaternaryEntry = (...args) => new QuaternaryEntry(...args)

var isCurrencyVisible = index => {
    switch (index) {
        case 0:
            return domain == 1
        case 1:
            return domain == 2 // This is coming in the next update
        default:
            return false // Invalid index
    }
}

var getPrimaryEquation = () => {
    let result
    if (page == 0) {
        theory.primaryEquationHeight = 100
        theory.primaryEquationScale = 1
        result = "B(x)=\\frac{x}{b_0}\\\\b_0=\\prod_{i=1}^{4}{\\sqrt[i+1]{\\max(1,b_i)}}"
    } else if (page == 1) {
        theory.primaryEquationHeight = 55
        theory.primaryEquationScale = 1
        result = `\\dot{\\rho}=k${publication.level >= 1 ? "m" : ""}t^{${getTExp(time_exp.level) == 1 ? "" : getTExp(time_exp.level).toString(getTExp(time_exp.level) == 1 ? 0 : getTExp(time_exp.level) == 0.5 ? 1 : 2)}}${unlock.level >= 1 ? "E^{-0.9}" : ""}c_1^{${getC1ExtraExponentDisplay(c1_exp.level)}B(c_2${unlock.level >= 2 ? "X" : ""})}${unlock.level >= 3 ? "Y" : ""}\
        \\\\`
        + theory.latexSymbol + "=\\max\\rho"
    } else if (page == 2) {
        theory.primaryEquationHeight = page2_equation_scale * 40
        theory.primaryEquationScale = page2_equation_scale
        result = `E=\\prod_{i}{e_i}`
    } else result = "\\text{Invalid Page}"
    return "\\begin{array}{c}" + result + "\\end{array}"
}
var getSecondaryEquation = () => {
    let result
    if (page == 0) {
        theory.secondaryEquationHeight = 80
        theory.secondaryEquationScale = 1
        result = [
            "b_1=\\log_{10^{20}}{\\rho}",
            "b_2=\\log_{10^{100}}{\\rho}",
            "b_3=\\log_{10^{500}}{\\rho}",
            "b_4=\\log_{10^{1000}}{\\rho}"
        ].join("\\\\")
    } else if (page == 1) {
        theory.secondaryEquationHeight = publication.level >= 1 ? unlock.level >= 2 ? unlock.level >= 3 ? 60 : 40 : 20 : 0
        theory.secondaryEquationScale = 1
        result = publication.level >= 1 ? `\\\\m=\\text{${getTextResource(TextResource.PublicationMultiplier)}}` : ""
        if (unlock.level >= 2) result += `\\\\X=x_1${unlock2.level >= 1 ? `x_2` : ``}`
        if (unlock.level >= 3) result += `\\\\Y=y_1${unlock.level >= 4 ? "y_2" : ""}`
    } else if (page == 2) {
        theory.secondaryEquationHeight = page2_equation_scale * (
            level => {
                switch (level) {
                    case 0: return 0
                    case 1: return 35
                    case 2: return 35
                    case 3: return 75
                    case 4: return 75
                    case 5: return 115
                    case 6: return 115
                    default: return 110
                }
            }
        )(unlockE.level)
        theory.secondaryEquationScale = page2_equation_scale
        result = "e_1=e-(1+\\frac{1}{n})^n"
        if (unlockE.level >= 2) result += ",\\quad e_2=e-(1+\\frac{a}{b})^{\\frac{b}{a}}"
        if (unlockE.level >= 3) result += "\\\\e_3=|1-\\int^e_1\\frac{\\sqrt[x]{e}}{t}dt|"
        if (unlockE.level >= 4) result += ",\\quad e_4=1-\\int^{(1+\\frac{1}{y})^y}_{1}\\frac{1}{t}dt"
        if (unlockE.level >= 5) result += "\\\\e_5=e-\\frac{l_0}{\\sqrt[l_0]{l_0!}}"
        if (unlockE.level >= 6) result += ",\\quad e_6=1-\\frac{\\sqrt{2\\pi p}(\\frac{p}{e})^p}{p!}"
    } else result = "\\text{Invalid Page}"
    return "\\begin{array}{c}" + result + "\\end{array}"
}
var getTertiaryEquation = () => {
    let result
    if (page == 1) {
        result = `c_1^{${getC1ExtraExponentDisplay(c1_exp.level)}B(c_2${unlock.level >= 2 ? "X" : ""})}=${tertiary_display[0]},\\quad b_0=${tertiary_display[1]}`
    } else if (page == 2) {
        const list = []
        if (unlockE.level >= 5) list.push(`l_0=l_1l_2`)
        result = list.join(",\\quad")
    } else result = ""
    return "\\begin{array}{c}" + result + "\\end{array}"
}
var getQuaternaryEntries = () => {
    const result = []
    result.push(formatQuaternaryEntry(
        "\\dot\\rho",
        (drho * (dt / 0.1)).toString(5)
    ))
    if (page == 0) {
        result.push(formatQuaternaryEntry(
            "b_0",
            tertiary_display[1]
        ))
        result.push(formatQuaternaryEntry(
            "b_1",
            balance_values[0].toString(3)
        ))
        result.push(formatQuaternaryEntry(
            "b_2",
            balance_values[1].toString(3)
        ))
        result.push(formatQuaternaryEntry(
            "b_3",
            balance_values[2].toString(3)
        ))
        result.push(formatQuaternaryEntry(
            "b_4",
            balance_values[3].toString(3)
        ))
    }
    if (page == 1) {
        result.push(formatQuaternaryEntry(
            "t",
            time.toString(2)
        ))
    }
    if (page == 1 && publication.level >= 1) {
        result.push(formatQuaternaryEntry(
            "m",
            BigNumber.from(theory.publicationMultiplier).toString(2)
        ))
    }
    if (unlock.level >= 1 && page != 0) result.push(formatQuaternaryEntry(
        "E",
        unlockE.level >= 1 ? getInverseEDisplay(E) : null
    ))
    if (page == 2) {
        result.push(formatQuaternaryEntry(
            "e_1",
            unlock.level >= 1 ? getInverseEDisplay(EDisplay[0]) : null
        ))
        result.push(formatQuaternaryEntry(
            "e_2",
            unlockE.level >= 2 ? getInverseEDisplay(EDisplay[1]) : null
        ))
        result.push(formatQuaternaryEntry(
            "e_3",
            unlockE.level >= 3 ? getInverseEDisplay(EDisplay[2]) : null
        ))
        result.push(formatQuaternaryEntry(
            "e_4",
            unlockE.level >= 4 ? getInverseEDisplay(EDisplay[3]) : null
        ))
        result.push(formatQuaternaryEntry(
            "e_5",
            unlockE.level >= 5 ? getInverseEDisplay(EDisplay[4]) : null
        ))
        result.push(formatQuaternaryEntry(
            "e_6",
            unlockE.level >= 6 ? getInverseEDisplay(EDisplay[5]) : null
        ))
    }
    return result
}

var getCurrencyFromTau = tau => [tau.max(BigNumber.ONE), currency.symbol]
var getPublicationMultiplier = tau => 15 * tau.pow(0.126) / (10 + tau).log10().pow(0.9)
var getPublicationMultiplierFormula = symbol => `m=\\frac{15{${symbol}}^{0.126}}{\\log^{0.9}_{10}(10+${symbol})}`
var getTau = () => currency.value.max(BigNumber.ZERO)
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber()

var getK = level => {
    const first_layer = BigNumber.ZERO + Utils.getStepwisePowerSum(Math.min(level, 3750), 2, 5, 0)

    const second_layer_base = Utils.getStepwisePowerSum(3751, 2, 5, 0) - Utils.getStepwisePowerSum(3750, 2, 5, 0)
    const second_layer = second_layer_base * Utils.getStepwisePowerSum(Math.max(level - 3750, 0), 2, 7, 0)

    return first_layer + second_layer
}
var getC1 = level => BigNumber.ONE + 0.5 * level
var getC1ExtraExponent = level => BigNumber.ONE + 0.03 * Math.min(2, level) + 0.02 * Math.max(0, level - 2)
var getC1ExtraExponentDisplay = level => {
    const value = getC1ExtraExponent(level)
    if (value == 1) return ""
    if ((value * 10) % 1 == 0) return value.toString(1)
    if ((value * 100) % 1 == 0) return value.toString(2)
    return value.toString(3)
}
var getC2BalanceDenominator = value => {
    const rho = value.max(1.01)
    const milestones = [BigNumber.TEN.pow(20), BigNumber.TEN.pow(100), BigNumber.TEN.pow(500), BigNumber.TEN.pow(1000)]
    let result = 1
    for (let i = 0; i <= milestones.length - 1; i++) {
        const balance_value = log(milestones[i], rho)
        if (balance_value > 1) {
            result *= balance_value.pow(1 / (2 + i))
        }
        balance_values[i] = balance_value
    }
    return result
}
var getC2Balance = c2 => {
    if (currency.value < BigNumber.TEN.pow(20)) {
        if (currency.value >= BigNumber.ONE) getC2BalanceDenominator(currency.value)
        tertiary_display[1] = BigNumber.ONE.toString(3)
        return c2
    }
    const denominator = getC2BalanceDenominator(currency.value)
    tertiary_display[1] = denominator.toString(3)
    return c2 / denominator
}
var getC2 = level => BigNumber.ONE + 0.25 * Math.min(level, 30) + (level > 30 ? (0.25 * (1 - 0.99 ** (level - 30)) / (1 - 0.99)) : 0)
var getN = level => BigNumber.ONE + Utils.getStepwisePowerSum(level, 2, 10, 0)
var getInverseA = level => BigNumber.E.pow(0.05 * level)
var getA = level => getInverseA(level).pow(-1)
var getB = level => BigNumber.ONE + Utils.getStepwisePowerSum(level, 2, 10, 0)
var getX = level => BigNumber.TWO + Utils.getStepwisePowerSum(level, 2, 10, 0)
var getY = level => (BigNumber.TWO + Utils.getStepwisePowerSum(level, 2, 10, 0)) / 4
var getL1 = level => BigNumber.TWO + Utils.getStepwisePowerSum(level, 2, 7, 0)
var getL2Exponent = level => level / BigNumber.ONE
var getL2 = level => BigNumber.from(1.2).pow(getL2Exponent(level))
var getP = level => Utils.getStepwisePowerSum(level, 2, 25, 0) / 100
var getX1 = level => BigNumber.ONE + 0.01 * Math.min(300, level) + 0.005 * Math.max(0, level - 300)
var getX2 = level => BigNumber.ONE + 0.002 * Math.min(60, level) + 0.001 * Math.max(0, level - 60)
var getY1Exponent = level => level / BigNumber.SIX
var getY1 = level => BigNumber.E.pow(getY1Exponent(level))
var getY2Exponent = level => level / BigNumber.TEN
var getY2 = level => BigNumber.PI.pow(getY2Exponent(level))
var getDT = level => Utils.getStepwisePowerSum(level, 2, 10, 0) / 10

var getTExp = level => BigNumber.ONE / 4 * (2 + (time_exp.isAvailable ? level : 0))

var getE1 = n => {
    if (n <= 100) return 1 / (BigNumber.E - (BigNumber.ONE + 1 / n).pow(n))
    // Laurent Series
    return 2 * n / BigNumber.E + 11 * n / (6 * BigNumber.E) - 5 / (72 * BigNumber.E * n) + 17 / (540 * BigNumber.E * BigNumber.from(n).pow(2))
}
var getE2 = (a, b) => getE1(b / a)
var getE3 = x => {
    if (x <= 20) return 1 / (BigNumber.E.pow(1 / x) - 1)
    // Laurent Series
    return x - 1 / 2 + 1 / (12 * x)
}
var getE4 = y => {
    if (y <= 10) return 1 / (1 - (BigNumber.ONE + 1 / y).pow(y).log())
    // Laurent Series
    return 2 * y + 4 / 3 - 1 / (9 * y) + 8 / (135 * y.pow(2)) - 31 / (810 * y.pow(3))
}
var getE5 = (l1, l2) => {
    const input = l1 * l2
    // From Sequential Limits
    const stirling = 2 * BigNumber.PI * input
    if (input < 1000) return BigNumber.ONE / (BigNumber.E - (BigNumber.E / (stirling.pow(BigNumber.PI / stirling))))
    else {
        // From Sequential Limits
        // Xelaroc's approximation
        const constant = BigNumber.PI.log() + stirling.log().log() - stirling.log()
        return ((constant.exp() - constant).exp() - 0.5) / BigNumber.E
    }
}
var getE6 = m => {
    const g = 7;
    const C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    function gamma(z) {
        z -= 1;
        var x = C[0];
        for (var i = 1; i < g + 2; i++)
            x += C[i] / (z + i);
        var t = z + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, (z + 0.5)) * Math.exp(-t) * x
    }
    if (m <= 0) return BigNumber.ONE
    if (m < 5) return BigNumber.ONE / (BigNumber.ONE - ((2 * m * BigNumber.PI).sqrt() * (m / BigNumber.E).pow(m)) / gamma(m + 1))
    // Laurent Series
    else return 12 * m + 0.5 + 293 / (720 * m) - 4406147 / (43545600 * m.pow(3)) + 14787105577 / (188116992000 * m.pow(5))
}

var factorial = number => {
    if (number <= 1) return 0
    return (2 * number * BigNumber.PI).sqrt() * (number / BigNumber.E).pow(number)
}
var derangement = number => {
    number = BigNumber.from(number)
    if (number < 2) return factorial(number)
    return (
        (-BigNumber.E).pow(number) * number.pow(-number) * (
            1 / (2 * BigNumber.PI * number.pow(3)).sqrt()
            -
            25 / (12 * (2 * BigNumber.PI * number.pow(5)))
            +
            1489 / (288 * (2 * BigNumber.PI * number.pow(7)))
            -
            799421 / (51840 * (2 * BigNumber.PI * number.pow(9)))
        ) + 1 / BigNumber.E
    ) * factorial(number)
}
var harmonic = number => {
    number = BigNumber.from(number)
    if (number <= 10) {
        let sum = 0;
        for (let i = 1; i <= number; i++) sum += 1 / i
        return sum
    }
    // Puiseux series
    return number.log() + 0.5772156649015328606065120900824024310421 + 1 / (2 * number) - 1 / (12 * number.pow(2)) + 1 / (120 * number.pow(4))
}

var getEDisplay = E => {
    const exponent = E.log10().floor()
    const base = BigNumber.from(E / BigNumber.TEN.pow(exponent))
    return `${base.toString(2)}e${exponent.toString(0)}`
}
var getInverseEDisplay = E => {
    const exponent = E.log10().floor()
    const base = BigNumber.from(E / BigNumber.TEN.pow(exponent))
    return `${(10 / base).toString(2)}e${(-(exponent + 1)).toString(0)}`
}

var getEquationOverlay = _ => {
    const children = [
        ui.createLatexLabel({
            text: version,
            fontSize: 10, 
            margin: new Thickness(4, 4),
            textColor: Color.TEXT_MEDIUM
        }),
        ui.createLatexLabel({
            isVisible: () => settings.display_overlay.max_drho,
            text: () => Utils.getMath(`\\max\\dot{\\rho}=${max_drho.toString(3)}\\quad(${publication_max_drho.toString(3)})`),
            fontSize: 10,
            margin: new Thickness(4, 4),
            textColor: Color.TEXT_MEDIUM,
            horizontalOptions: LayoutOptions.END
        }),
        ui.createLatexLabel({
            isVisible: () => settings.display_overlay.time,
            text: () => {
                const formatted = formatTime(total_time[1])
                const first = formatted[0]
                formatted.splice(0, 1)
                return Utils.getMath(`\\text{${getTextResource(TextResource.Time)}}:\\quad${first}`) + ":" + formatted.join(":")
            },
            fontSize: 10,
            margin: new Thickness(4, 4),
            textColor: Color.TEXT_MEDIUM,
            verticalOptions: LayoutOptions.END,
            horizontalOptions: LayoutOptions.END
        })
    ]
    const grid = ui.createGrid({
        inputTransparent: true,
        cascadeInputTransparent: true,
        children,
        onTouched: event => {
            if (event.type != TouchType.PRESSED) return
            tap_count++
        }
    })
    return grid
}

var getInternalState = () => JSON.stringify({
    version,
    settings,
    lifetime_total_time: total_time[0].toBase64String(),
    publication_total_time: total_time[1].toBase64String(),
    time: time.toBase64String(),
    max_drho: max_drho.toBase64String(),
    total_rho: total_rho.toBase64String(),
    ticks: ticks.toBase64String(),

    recovering,
    recovery_time: recovery_time.toBase64String()
})
var setInternalState = string => {
    if (!string) return

    const state = JSON.parse(string)
    settings = state.settings ?? settings
    if (typeof state.total_time == "object") total_time = [state.total_time, state.total_time]
    else total_time = [
        BigNumber.fromBase64String(state.lifetime_total_time ?? BigNumber.ZERO.toBase64String()),
        BigNumber.fromBase64String(state.publication_total_time ?? BigNumber.ZERO.toBase64String())
    ]
    time = BigNumber.fromBase64String(state.time ?? BigNumber.ZERO.toBase64String())
    max_drho = BigNumber.fromBase64String(state.max_drho ?? BigNumber.ZERO.toBase64String())
    publication_max_drho = BigNumber.fromBase64String(state.publication_max_drho ?? BigNumber.ZERO.toBase64String())
    total_rho = BigNumber.fromBase64String(state.total_rho ?? BigNumber.ZERO.toBase64String())
    ticks = BigNumber.fromBase64String(state.ticks ?? BigNumber.ZERO.toBase64String())

    recovering = state.recovering ?? false
    recovery_time = BigNumber.fromBase64String(state.recovery_time ?? BigNumber.ZERO.toBase64String())
}

var canResetStage = () => true
var getResetStageMessage = () => getTextResource(TextResource.ResetStage)
var resetStage = () => {
    if (theory.canPublish) {
        theory.publish()
        return
    }
    for (const upgrade of theory.upgrades) upgrade.level = 0
    currency.value = 0
    currency2.value = 0
    postPublish()
    theory.clearGraph()
}

var canGoToPreviousStage = () => page == 2 || page == 1
var goToPreviousStage = () => page--
var canGoToNextStage = () => (page == 1 && unlock.level >= 1) || page == 0
var goToNextStage = () => page++

class SuperExponentialCost {
    constructor(original, base, increment) {
        this.a = BigNumber.from(original)
        this.c = BigNumber.from(base)
        this.d = BigNumber.from(increment)
    }

    cost(level) {
        return this.a * this.c.pow(level) * this.d.pow(0.5 * level * (level + 1))
    }

    cumulative_cost(level, amount) {
        let result = BigNumber.ZERO
        for (let i = 0; i < amount; i++) result += this.cost(level + i)
        return result
    }

    max(level, currency) {
        let cumulative = BigNumber.ZERO
        let current_level = level
        while (cumulative < currency) {
            cumulative += this.cost(current_level)
            current_level++
        }
        return Math.round(current_level - level - 1)
    }

    get functions() {
        return [
            level => this.cost(level),
            (level, amount) => this.cumulative_cost(level, amount),
            (level, currency) => this.max(level, currency)
        ]
    }

    get cost_model() {
        return new CustomCost(...this.functions)
    }
}

class Popups {
    static get statistics() {
        const popup = ui.createPopup({
            isPeekable: false,
            title: getTextResource(TextResource.Statistics.Title),
            content: ui.createGrid({
                children: [
                    ui.createLatexLabel({
                        text: () => {
                            const formatted_time = [formatTime(total_time[0]), formatTime(total_time[1])]
                            const formatted_recovery_time = formatTime(recovery_time)
                            const sfirst = formatted_time[0][0]
                            formatted_time[0].splice(0, 1)
                            const first = formatted_time[1][0]
                            formatted_time[1].splice(0, 1)
                            const rfirst = formatted_recovery_time[0]
                            formatted_recovery_time.splice(0, 1)
                            return [
                                Utils.getMath(`\\text{${getTextResource(TextResource.Ticks)}:}\\quad ${ticks.toString(0)}`),
                                Utils.getMath(`\\text{${getTextResource(TextResource.TimeSinceStarted)}}:\\quad${sfirst}`) + ":" + formatted_time[0].join(":"),
                                Utils.getMath(`\\text{${getTextResource(TextResource.TimeSincePublication)}}:\\quad${first}`) + ":" + formatted_time[1].join(":"),
                                Utils.getMath(`\\text{${getTextResource(TextResource.RecoveryTime)}}:\\quad${rfirst}`) + ":" + formatted_recovery_time.join(":"),
                                getTextResource(TextResource.Lifetime) + Utils.getMath(`\\quad\\max\\dot{\\rho}=${max_drho.toString(5)}`),
                                getTextResource(TextResource.Publication) + Utils.getMath(`\\quad\\max\\dot{\\rho}=${publication_max_drho.toString(5)}`),
                                Utils.getMath(`\\text{${getTextResource(TextResource.Total)} }\\rho =${total_rho}`)
                            ].join("\\\\")
                        }
                    })
                ]
            })
        })
        return popup
    }

    static get settings() {
        throw new Error("Work in progress")
    }
}

initialize()
