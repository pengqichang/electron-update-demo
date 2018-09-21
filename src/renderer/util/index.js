const checkVersion = (current, latest) => {
    console.warn(current, latest)
    return
    if(typeof current ==="string"){
        current = current.replace("'","");
        latest = latest.replace("'","");
    }
    if (current === latest) {
        return 1;//版本无更新
    } else {
        const curVersionNum = current.split(".");
        const latestVersionNum = latest.split(".");
        const [current1, current2, current3] = curVersionNum;
        const [latest1, latest2, latest3] = latestVersionNum;

        if (current1 < latest1 || current2 < latest2) {
            return 2;//强制更新
        }
        if (current3 < latest3) {
            return 3;//小版本可选升级
        }
        return 0;
    }
}

export {
    checkVersion
}
