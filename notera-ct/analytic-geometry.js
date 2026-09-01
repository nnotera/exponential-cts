import { ExponentialCost, LinearCost } from "./api/Costs";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "analytic_geometry";
var name = "Analytic Geometry";
var description = "Just a 'simple' custom theory about Functions, Coordinates and some big numbers \n\n You might notice that the number of the root changes, its purpose is to balance ρ gain with a simple formula: \n\n If ρ<1e25, it's 2.4 \n\n If ρ<1e50, it's 2.5 \n\n If ρ>1e50, it's 2.65"
var authors = "OmarBuso";
var version = 1.1;

// Update 1.1:
// Fixed and balanced q1 Exponent Milestone
// Made the function updateProd() to compute "product" only when a1/a2/n updates
// Changed the way "product" computes

requiresGameVersion("1.4.33");

var currency;                                           // ρ
var q1, q2, a1, a2, n;                                  // Variables
var q1Exp, a1Boost, a2Term, funcXY, addFuncZ, funcZ;    // Milestones
var tauMultiplier = 0.4;                                // Conversion rate from ρ to τ
var updateprod_flag = true;

// sorry for bad english
// functions > vars
// also, what's the difference between JavaScript and TypeScipt?

function init() {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades
    // q1
    {
        let getDesc = (level) => "q_1=" + getQ1(level).toString(0);
        q1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, 0.7)));
        q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount));
    }

    // q2
    {
        let getDesc = (level) => "q_2=10^{" + level + "}";
        let getInfo = (level) => "q_2=" + getQ2(level).toString(0);
        q2 = theory.createUpgrade(1, currency, new ExponentialCost(15, 3));
        q2.getDescription = (_) => Utils.getMath(getDesc(q2.level));
        q2.getInfo = (amount) => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount));
    }

    // a1
    {
        let getDesc = (level) => "a_1=" + getA1(level).toString(1);
        a1 = theory.createUpgrade(2, currency, new ExponentialCost(25, 0.2));
        a1.getDescription = (_) => Utils.getMath(getDesc(a1.level));
        a1.getInfo = (amount) => Utils.getMathTo(getDesc(a1.level), getDesc(a1.level + amount));
        a1.bought = (_) => (updateprod_flag = true);
    }

    // a2
    {
        let getDesc = (level) => "a_2=" + getA2(level).toString(0);
        a2 = theory.createUpgrade(3, currency, new ExponentialCost(BigNumber.from(1e125), Math.log2(1e10)));
        a2.getDescription = (_) => Utils.getMath(getDesc(a2.level));
        a2.getInfo = (amount) => Utils.getMathTo(getDesc(a2.level), getDesc(a2.level + amount));
        a2.bought = (_) => (updateprod_flag = true);
    }

    // n
    {
        let getDesc = (level) => "n=" + getN(level).toString(0);
        let getInfo = (level) => "n=" + getN(level).toString(0);
        n = theory.createUpgrade(4, currency, new CustomCost(getNCost));
        n.maxLevel = 50;
        n.getDescription = (_) => Utils.getMath(getDesc(n.level));
        n.getInfo = (amount) => Utils.getMathTo(getInfo(n.level), getInfo(n.level + amount));
        n.bought = (_) => (updateprod_flag = true);
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e12);
    theory.createAutoBuyerUpgrade(2, currency, 1e25);

    ///////////////////////
    // Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25 * tauMultiplier, 25 * tauMultiplier));

    // Upgrade q1 Exponent
    {
        q1Exp = theory.createMilestoneUpgrade(0, 3);
        q1Exp.getDescription = (amount) =>
        Localization.getUpgradeIncCustomExpDesc('q_1',
        q1ExpTable[q1Exp.level + amount] - q1ExpTable[q1Exp.level] || 0);
        q1Exp.getInfo = (amount) =>
        Localization.getUpgradeIncCustomExpInfo('q_1',
        q1ExpTable[q1Exp.level + amount] - q1ExpTable[q1Exp.level] || 0);
        q1Exp.boughtOrRefunded = (_) => {
            theory.invalidatePrimaryEquation();
            updateAvailability();
        };
    }

    // Upgrade a1 Scaling
    {
        a1Boost = theory.createMilestoneUpgrade(1, 1);
        a1Boost.getDescription = (_) => "Improve ${a_1}$ variable scaling";
        a1Boost.getInfo = (_) => "Improves ${a_1}$ variable scaling";
        a1Boost.boughtOrRefunded = (_) => {
            updateprod_flag = true;
            updateAvailability();
        };
        a1Boost.canBeRefunded = (_) => a2Term.level === 0;
    }

    // Add a2 Term
    {
        a2Term = theory.createMilestoneUpgrade(2, 1);
        a2Term.description = Localization.getUpgradeAddTermDesc("a_2");
        a2Term.info = Localization.getUpgradeAddTermInfo("a_2");
        a2Term.boughtOrRefunded = (_) => {
            theory.invalidatePrimaryEquation();
            updateprod_flag = true;
            updateAvailability();
        };
        a2Term.canBeRefunded = (_) => funcXY.level === 0;
    }

    // X(x) and Y(x) functions upgrade
    {
        funcXY = theory.createMilestoneUpgrade(3, 3);
        funcXY.getDescription = (_) => "Improve X(x) and Y(x) functions";
        funcXY.getInfo = (_) => "Improves X(x) and Y(x) functions";
        funcXY.boughtOrRefunded = (_) => {
            theory.invalidatePrimaryEquation();
            theory.invalidateSecondaryEquation();
            updateprod_flag = true;
            updateAvailability();
        };
        funcXY.canBeRefunded = (_) => addFuncZ.level === 0;
    }

    // Add Z(x) function
    {
        addFuncZ = theory.createMilestoneUpgrade(4, 1);
        addFuncZ.getDescription = (_) => "Add a new dimension";
        addFuncZ.getInfo = (_) => "Adds the function Z(x)";
        addFuncZ.boughtOrRefunded = (_) => {
            theory.invalidatePrimaryEquation();
            theory.invalidateSecondaryEquation();
            updateprod_flag = true;
            updateAvailability();
        };
        addFuncZ.canBeRefunded = (_) => funcZ.level === 0;
    }

    // Z(x) function upgrade
    {
        funcZ = theory.createMilestoneUpgrade(5, 3);
        funcZ.getDescription = (_) => "Improve Z(x) function";
        funcZ.getInfo = (_) => "Improves Z(x) function";
        funcZ.boughtOrRefunded = (_) => {
            theory.invalidatePrimaryEquation();
            theory.invalidateSecondaryEquation();
            updateprod_flag = true;
            updateAvailability();
        };
    }
    q1Exp.isAvailable = true;
    a1Boost.isAvailable = true;

    updateAvailability();

    /////////////////
    //// Achievements                   Just testing, these are not important for now
    theory.createAchievement(0, "One Last Time", "Buy the last available q1 Exponent Milestone", () => q1Exp.level === 3);
    theory.createAchievement(1, "Only 50?!", "Buy all the n Upgrades", () => n.level === 50);
    theory.createAchievement(2, "Not very efficient...", "Reach 1e100ρ without buying any n Upgrade", () => n.level === 0 && currency.value > BigNumber.from(1e100));

}
var updateAvailability = () => {
  a2Term.isAvailable = a1Boost.level === 1;
  funcXY.isAvailable = q1Exp.level === 3 && a2Term.level === 1;
  addFuncZ.isAvailable = funcXY.level === 3;
  funcZ.isAvailable = addFuncZ.level === 1;
  a2.isAvailable = a2Term.level === 1;
};

function tick(elapsedTime, multiplier) {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    let intA1 = getA1(a1.level);
    let intN = parseInt(getN(n.level).toString());
    let q1Val = getQ1(q1.level).pow(getQ1Exp(q1Exp.level));
    let q2Val = getQ2(q2.level)

    // Functions X(x), Y(x) and Z(x)
    const X = (x) => {
        if (funcXY.level === 0) return intA1 * (x ** (x - 0.3 * intN));
        if (funcXY.level === 1) return 2 * intA1 * (x ** intN) * Math.cos(x);
        if (funcXY.level === 2) return intA1 * (1.2 ** (x ** intN)) - 1;
        if (funcXY.level === 3) return intA1 * (x ** (1.1 * intN));
        return 0;
    };

    const Y = (x) => {
        if (funcXY.level === 0) return intA1 * (x ** (x - 0.3 * intN));
        if (funcXY.level === 1) return 2 * intA1 * (x ** intN) * Math.sin(x);
        if (funcXY.level === 2) return intA1 * ((2 ** x) ** (2 * intN));
        if (funcXY.level === 3) return x + (intA1 * (2 ** intN)) / (1 + (2 ** (20 - x)));
        return 0;
    };

    const Z = (x) => {
        if (addFuncZ.level === 0) return 0;
        if (funcZ.level === 0) return intA1 * (x ** (intN - x / 2));
        if (funcZ.level === 1) return 2 * intA1 * (x ** (2 * x - intN / 3));
        if (funcZ.level === 2) return intA1 * ((2 ** x) ** (1 + Math.cos(x))) + 1.2 ** intN;
        if (funcZ.level === 3) return (intA1 ** 0.2) * (intN ** (Math.log10(x) / Math.log10(5)));
        return 0;
    };
    // If someone wants to see where are the points, use a graphing calculator and put something like (X(a), Y(a), Z(a)) for a=[1,2,...,15]

    let product = BigNumber.ONE;
    function updateProd() {
        for (let i = 1; i <= intN; i++) {
            let t = i + Math.log2(getA2(a2.level));
            let xVal = BigNumber.from(X(t)); // Totally necesary conversions to BigNumber
            let yVal = BigNumber.from(Y(t));
            let zVal = BigNumber.from(Z(t));

            const pointDistance = BigNumber.from((xVal.pow(2) + yVal.pow(2) + zVal.pow(2)).sqrt());     // Distance function
            const pointSum = BigNumber.from(xVal.abs() + yVal.abs() + zVal.abs());                      // Sum of point coordinate
            const term = BigNumber.from(pointDistance * pointSum * q2Val);
            product *= BigNumber.from(term); // Definetly not a way to overcomplicate a product function
        }
    }
        if (updateprod_flag = true && n.level < 51) {
        updateProd();
        updateprod_flag = false;
    }

    currency.value += BigNumber.from(dt * bonus * q1Val * nthRoot(product, rootBalance() * intN));
}

function nthRoot(inRoot, intN){ return BigNumber.from(inRoot).pow(1 / intN)};

function postPublish() {
    prevN = 1;
    updateprod_flag = true;
    theory.invalidatePrimaryEquation();
};

function getPrimaryEquation() {
    theory.primaryEquationHeight = 70;
    let result = `\\dot{\\rho} = q_1 `;
    if (q1Exp.level !== 0) result += `^{${getQ1Exp(q1Exp.level)}}`;
    if (a2Term.level === 0) {
        result += `\\cdot \\sqrt[{${rootBalance()}}n]{\\prod_{i=1}^{n}(d(i) \\cdot z(i) \\cdot q_2)}`;

        theory.primaryEquationScale = 1;
    };
    if (a2Term.level === 1) {
        result += `\\cdot \\sqrt[{${rootBalance()}}n]{\\prod_{i=1}^{n}(d(t) \\cdot z(t) \\cdot q_2)}, \\quad t = i+log_2(a_2)`;
        theory.primaryEquationScale = 0.90;
    };
    return result;
}
function getSecondaryEquation() {
    let result = "\\begin{matrix} d(x) = ";
    theory.secondaryEquationHeight = 80;
    if (addFuncZ.level === 1) {
        result += `\\sqrt{X(x)^2 + Y(x)^2 + Z(x)^2} \\quad z(x) = |X(x)| + |Y(x)| + |Z(x)| \\\\\\\\`;
        theory.secondaryEquationScale = 0.95;
    }
    else {
        result += `\\sqrt{X(x)^2 + Y(x)^2} \\qquad z(x) = |X(x)| + |Y(x)| \\\\\\\\`;
        theory.secondaryEquationScale = 1;
    };

    if (funcXY.level === 0) result += `X(x)=a_1 x^{x-0.3n} \\quad Y(x)=a_1 x^{x-0.3n}`;
    if (funcXY.level === 1) result += `X(x)=2a_1 x^n \\cos x \\quad Y(x)=2a_1 x^n \\sin x`;
    if (funcXY.level === 2) result += `X(x)=a_1 1.1^{\\sqrt{x^n}} - 1 \\quad Y(x)=a_1 x^{1.05n}`;
    if (funcXY.level === 3) result += `X(x)=a_1 x^{1.1n} \\quad Y(x)=x + \\frac{a_1 2^n}{1 + 2^{20-x}}`;
    if (addFuncZ.level === 1) {
        if (funcZ.level === 0) result += `\\quad Z(x)=a_1 x^{n -\\frac{x}{2}}`;
        if (funcZ.level === 1) result += `\\quad Z(x)=a_1 x^{2x - \\frac{n}{3}}`;
        if (funcZ.level === 2) result += `\\quad Z(x)=a_1 (2^x)^{1+\\cos x} + 1.2^n`;
        if (funcZ.level === 3) result += `\\quad Z(x)=a_1^{0.2} \\cdot n^{log_5 (x)}`;
    };
    result += "\\end{matrix}";
    return result;
}
function getTertiaryEquation() {
    let result = theory.latexSymbol + "=\\max\\rho^{" + tauMultiplier + "}\\quad ";
    return result;
}
var getPublicationMultiplier = (tau) => tau.pow(0.32);
var getPublicationMultiplierFormula = (symbol) => `${symbol}^{0.32}`;
var getTau = () => currency.value.pow(BigNumber.from(tauMultiplier));
var getCurrencyFromTau = (tau) => [tau.max(BigNumber.ONE).pow(1/tauMultiplier), currency.symbol];
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getQ1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var q1ExpTable = [
    BigNumber.ONE,
    BigNumber.from(1.25),
    BigNumber.from(1.40),
    BigNumber.from(1.50)
];
var getQ1Exp = (level) => q1ExpTable[level];
var getQ2 = (level) => BigNumber.TEN.pow(BigNumber.from(level));
var getA1 = (level) => {
    if(a1Boost.level === 0){ return BigNumber.from(1 + 0.5 * level); }
    else{ return BigNumber.ONE + BigNumber.from(0.5) * Utils.getStepwisePowerSum(level, 2, 20, 0); };
};
var getA2 = (level) => BigNumber.from(1 + 5 * level);
var getN = (level) => BigNumber.from(1 + level);
var getNCost = (level) => { // O(1) !
    if (level === 0) return BigNumber.from(1000);
    if (level < 5) return BigNumber.from(100).pow(level + 1);

    let base = BigNumber.from(100).pow(6);
    let exponent = ((level - 3) * (level - 4)) / 2; // Sum of (i - 3) from i = 5 to level
    return base * BigNumber.TEN.pow(exponent);
};
var rootBalance = () => { // why, just why? -future me
    if (currency.value < BigNumber.from(1e25)) return 2.4; theory.invalidatePrimaryEquation();
    if (currency.value < BigNumber.from(1e50)) return 2.5; theory.invalidatePrimaryEquation();
    if (currency.value > BigNumber.from(1e50)) return 2.65; theory.invalidatePrimaryEquation();
    return 1;
};

// I know there might be a lot of unnecesary semicolons, but just to be sure I put them everywhere I can
// Useful commands for the SDK:
// theory.reset()
// currency.value = BigNumber.from(1e100)
// log(`Some Variable`)

init();
