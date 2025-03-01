const path = require("path");

const android = require("@react-native-community/cli-platform-android");
const ios = require("@react-native-community/cli-platform-ios");

const androidRoot = path.resolve(__dirname, '..')
const iosRelativeRoot = path.join('..', 'apple')
const packageName = "dev.mateusz1913.brownfieldtest"

/** @type import("@react-native-community/cli-types").Config */
module.exports = {
    project: {
        android: {
            sourceDir: androidRoot,
            appName: "app",
            manifestPath: path.join(androidRoot, 'app', 'src', 'main', 'AndroidManifest.xml'),
            packageName,
        },
        ios: {
            sourceDir: iosRelativeRoot,
            automaticPodsInstallation: false,
        },
    },
    platforms: {
        android: {
            projectConfig: android.projectConfig,
        },
        ios: {
            projectConfig: ios.projectConfig,
        },
    }
};
