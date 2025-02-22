# Brownfield RN Android

## Basic setup

(Based on RN 0.77 docs section - https://reactnative.dev/docs/integration-with-existing-apps?package-manager=yarn&language=kotlin&ios-language=swift)

1. Create directory for JS code, e.g. `./js`
2. Inside JS directory create following:
    - `package.json` with content copied from "HelloWorld" RN template
    - `metro.config.js` with the following content:
    ```js
    const {getDefaultConfig} = require('@react-native/metro-config');

    module.exports = getDefaultConfig(__dirname);
    ```
    - `react-native.config.js` with the following content (replace `<package-name>` with appropriate android package name and adjust `androidRoot` to point to root android directory based on JS directory location):
    ```js
    const path = require("path");

    const android = require("@react-native-community/cli-platform-android");
    
    const androidRoot = path.resolve(__dirname, '..')
    const packageName = "<package-name>"
    
    /** @type import("@react-native-community/cli-types").Config */
    module.exports = {
        project: {
            android: {
                sourceDir: androidRoot,
                appName: "app",
                manifestPath: path.join(androidRoot, 'app', 'src', 'main', 'AndroidManifest.xml'),
                packageName,
            }
        },
        platforms: {
            android: {
                projectConfig: android.projectConfig,
            }
        }
    };
    ```
3. Add `node_modules` to `.gitignore`
4. Run `yarn install` from JS directory location
5. Configure Gradle:
    - Make following changes in `settings.gradle.kts`
        - Add React Native Gradle plugin in `pluginManagement` block:
            - if `pluginManagement` block does not exist, create one
            - create helper constant inside `pluginManagement` that represents JS directory location: `val JS_SRCS_DIR = "<js-directory>"` (replace `<js-directory>` with actual relative path from root android directory to JS directory)
            - add following content to `pluginManagement` block: `includeBuild("$JS_SRCS_DIR/node_modules/@react-native/gradle-plugin")`
        - Replace `dependencyResolutionManagement` block with `buildscript` (necessary if it uses `repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)`)
            - Copy the `repositories` closure from `dependencyResolutionManagement` block
            - Go to root level `build.gradle.kts` and create `buildscript` block if it does not exist
            - Paste `repositories` closure into `buildscript`
        - Add ReactSettings Gradle plugin
            - if `plugins` block does not exist, create one
            - add following content to `plugins` block: `id("com.facebook.react.settings")`
        - Create helper constant that represents JS directory location: `val JS_SRCS_DIR = "<js-directory>"` (replace `<js-directory>` with actual relative path from root android directory to JS directory)
        - Configure ReactSettingsExtension like so:
        ```
        extensions.configure<com.facebook.react.ReactSettingsExtension> {
            autolinkLibrariesFromCommand(workingDirectory = file(JS_SRCS_DIR))
        }
        ```
        - Add React Native Gradle Plugin for all projects `includeBuild("$JS_SRCS_DIR/node_modules/@react-native/gradle-plugin")`
    - After changes, the `settings.gradle.kts` should look like following:
    ```
    pluginManagement {
        val JS_SRCS_DIR = "./js"

        repositories {
            google {
                content {
                    includeGroupByRegex("com\\.android.*")
                    includeGroupByRegex("com\\.google.*")
                    includeGroupByRegex("androidx.*")
                }
            }
            mavenCentral()
            gradlePluginPortal()
        }
        includeBuild("$JS_SRCS_DIR/node_modules/@react-native/gradle-plugin")
    }

    plugins {
        id("com.facebook.react.settings")
    }

    val JS_SRCS_DIR = "./js"
    extensions.configure<com.facebook.react.ReactSettingsExtension> {
        autolinkLibrariesFromCommand(workingDirectory = file(JS_SRCS_DIR))
    }
    includeBuild("$JS_SRCS_DIR/node_modules/@react-native/gradle-plugin")

    rootProject.name = "brownfieldproject"
    include(":app")
    ``` 
    - Make following changes in `build.gradle.kts`:
        - Add React Native Gradle plugin:
            - if `plugins` block exists, add `id("com.facebook.react") apply false` inside
            - if `buildscript` block does not have `dependencies` block inside, create one
            - add `classpath("com.facebook.react:react-native-gradle-plugin")` inside `buildscript.dependencies`
        - Create `clean` task that removes autolinking build directory:
        ```
        tasks.register("clean", Delete::class) {
            delete("${rootProject.projectDir}/build")
        }
        ```
    - After changes, the `build.gradle.kts` should look like following:
    ```
    // Top-level build file where you can add configuration options common to all sub-projects/modules.
    plugins {
        alias(libs.plugins.android.application) apply false
        alias(libs.plugins.kotlin.android) apply false
        alias(libs.plugins.kotlin.compose) apply false
        id("com.facebook.react") apply false
    }

    buildscript {
        repositories {
            google()
            mavenCentral()
        }
        dependencies {
            classpath("com.facebook.react:react-native-gradle-plugin")
        }
    }

    tasks.register("clean", Delete::class) {
        delete("${rootProject.projectDir}/build")
    }
    ```
    - Add RN Gradle properties
    ```
    # RN properties
    reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
    newArchEnabled=true
    hermesEnabled=true
    ```
    - Modify to Kotlin version for the application to match the one used by RN (e.g. in libs.versions.toml)
    - Make following changes in `app/build.gradle.kts`:
        - if `plugins` block does not exist, create one
        - add `id("com.facebook.react")` inside `plugins` block
        - make sure that `compileOptions` and kotlinOptions use JVM 17
        - add RN dependencies in `dependencies` block
        ```
        implementation("com.facebook.react:react-android")
        implementation("com.facebook.react:hermes-android")
        ```
        - configure React Native Gradle plugin:
            - add `react` block
            - create helper constant inside `react` block that represents JS directory location: `val JS_SRCS_DIR = "<js-directory>"` (replace `<js-directory>` with actual relative path from android `app` directory to JS directory)
            - configure following properties
            ```
            root = file(JS_SRC_DIR)
            reactNativeDir = file("${JS_SRC_DIR}/node_modules/react-native")
            codegenDir = file("${JS_SRC_DIR}/node_modules/@react-native/codegen")
            cliFile = file("${JS_SRC_DIR}/node_modules/@react-native-community/cli/build/bin.js")
            bundleCommand = ""
            entryFile = file("${JS_SRC_DIR}/index.js")
            jsRootDir = file(JS_SRC_DIR)
            ```
            - add `autolinkLibrariesWithApp()` at the end of `react` block
        - modify "clean" Gradle task to handle removing `.cxx` directory:
        ```
        tasks.named("clean") {
            delete("${project.projectDir}/.cxx")
        }
        ```
    - After changes, the `app/build.gradle.kts` should like following:
    ```
    plugins {
        alias(libs.plugins.android.application)
        alias(libs.plugins.kotlin.android)
        alias(libs.plugins.kotlin.compose)
        id("com.facebook.react")
    }

    android {
        namespace = "com.brownfield.project"
        compileSdk = 35

        defaultConfig {
            applicationId = "com.brownfield.project"
            minSdk = 28
            targetSdk = 35
            versionCode = 1
            versionName = "1.0"

            testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        }

        buildTypes {
            release {
                isMinifyEnabled = false
                proguardFiles(
                    getDefaultProguardFile("proguard-android-optimize.txt"),
                    "proguard-rules.pro"
                )
            }
        }
        compileOptions {
            sourceCompatibility = JavaVersion.VERSION_17
            targetCompatibility = JavaVersion.VERSION_17
        }
        kotlinOptions {
            jvmTarget = "17"
        }
        buildFeatures {
            compose = true
        }
    }

    dependencies {

        implementation(libs.androidx.core.ktx)
        implementation(libs.androidx.lifecycle.runtime.ktx)
        implementation(libs.androidx.activity.compose)
        implementation(platform(libs.androidx.compose.bom))
        implementation(libs.androidx.ui)
        implementation(libs.androidx.ui.graphics)
        implementation(libs.androidx.ui.tooling.preview)
        implementation(libs.androidx.material3)
        testImplementation(libs.junit)
        androidTestImplementation(libs.androidx.junit)
        androidTestImplementation(libs.androidx.espresso.core)
        androidTestImplementation(platform(libs.androidx.compose.bom))
        androidTestImplementation(libs.androidx.ui.test.junit4)
        debugImplementation(libs.androidx.ui.tooling)
        debugImplementation(libs.androidx.ui.test.manifest)

        // RN deps
        implementation("com.facebook.react:react-android")
        implementation("com.facebook.react:hermes-android")
    }

    react {
        val JS_SRC_DIR = "../js"

        root = file(JS_SRC_DIR)
        reactNativeDir = file("${JS_SRC_DIR}/node_modules/react-native")
        codegenDir = file("${JS_SRC_DIR}/node_modules/@react-native/codegen")
        cliFile = file("${JS_SRC_DIR}/node_modules/@react-native-community/cli/build/bin.js")
        bundleCommand = ""
        entryFile = file("${JS_SRC_DIR}/index.js")
        jsRootDir = file(JS_SRC_DIR)

        autolinkLibrariesWithApp()
    }

    tasks.named("clean") {
        delete("${project.projectDir}/.cxx")
    }
    ```
6. Add `INTERNET` permission in `app/src/main/AndroidManifest.xml`
```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

+   <uses-permission android:name="android.permission.INTERNET" />

    <application
      android:name=".MainApplication">
    </application>
</manifest>
```
7. Create `app/src/debug/AndroidManifest.xml` if it does not exist and add "cleartext traffic" flag
```diff
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application
+       android:usesCleartextTraffic="true"
+       tools:targetApi="28"
    />
</manifest>
```
8. Create `index.js` in JS directory and register JS components:
```js
import { AppRegistry } from 'react-native';

import BrownfieldScreen from './src/BrownfieldScreen';
import BrownfieldWidget from './src/BrownfieldWidget';

AppRegistry.registerComponent('MyBrownfieldScreen', () => BrownfieldScreen);
AppRegistry.registerComponent('MyBrownfieldWidget', () => BrownfieldWidget);
```
9. Create JS components and implement them:
```js
// src/BrownfieldScreen
```
import React, { useEffect } from 'react';
import { Alert, BackHandler, Image, StyleSheet, Text, View } from 'react-native';

const src = "https://picsum.photos/id/204/500/333";

function BrownfieldScreen() {
    useEffect(() => {
        function handleBack() {
            Alert.alert(
                'Exit warning',
                'Are you sure you want to exit?',
                [
                    { text: 'Cancel', onPress: () => {} },
                    { text: 'Exit', onPress: () => { BackHandler.exitApp() } }
                ]
            );
            return true;
        }

        const subscription = BackHandler.addEventListener('hardwareBackPress', handleBack);

        return () => {
            subscription.remove();
        };
    }, []);
    return (
        <View style={styles.fill}>
            <Image src={src} style={styles.image} />
            <Text style={styles.label}>Sample brownfield screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    fill: {
        alignSelf: 'stretch',
        backgroundColor: 'pink',
        flex: 1,
        padding: 10,
    },
    image: {
        width: 300,
        height: 200,
    },
    label: {
        color: 'green',
        fontSize: 24,
        padding: 20,
    },
});

export default BrownfieldScreen;
```js
// src/BrownfieldWidget
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const src = "https://picsum.photos/id/366/400/300";
const src2 = "https://picsum.photos/id/487/400/300"

interface Props {
    backgroundColor: string;
    label: string;
    src: string;
}

function BrownfieldWidget({
    backgroundColor = 'lightblue',
    label = 'Sample embedded widget',
    src = 'https://picsum.photos/id/506/4561/3421',
}) {
    return (
        <View style={[styles.fill, { backgroundColor }]}>
            <Image src={src} style={styles.image} />
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    fill: {
        alignSelf: 'stretch',
        flex: 1,
        padding: 10,
    },
    image: {
        width: 300,
        height: 225,
    },
    label: {
        color: 'green',
        fontSize: 24,
        padding: 20,
    },
});

export default BrownfieldWidget;
```
10. Create custom `ReactActivity` to display whole RN screen
```
// `./app/src/main/java/com/brownfield/project/MyReactActivity.kt`
package com.brownfield.project

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MyReactActivity : ReactActivity() {
    override fun getMainComponentName(): String {
        return "MyBrownfieldScreen"
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
    }
}
```
11. Create custom Composable that renders `AndroidView` with `ReactFragment`:
```
// `./app/src/main/java/com/brownfield/project/MyReactNativeComposable.kt`
package com.brownfield.project

import android.content.Context
import android.content.ContextWrapper
import android.os.Bundle
import android.view.View
import android.widget.FrameLayout.LayoutParams
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.os.bundleOf
import androidx.fragment.app.FragmentActivity
import androidx.fragment.app.FragmentContainerView
import com.facebook.react.ReactFragment
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled

fun Context.findFragmentActivity(): FragmentActivity {
    var context = this
    while (context is ContextWrapper) {
        if (context is FragmentActivity) return context
        context = context.baseContext
    }
    throw IllegalStateException("no activity")
}

@Composable
fun MyReactNativeComposable(componentName: String, modifier: Modifier = Modifier, launchOptions: Bundle = bundleOf()) {
    val fragmentActivity = LocalContext.current.findFragmentActivity()

    AndroidView(
        factory = { context ->
            val view = FragmentContainerView(context).apply {
                layoutParams = LayoutParams(
                    LayoutParams.MATCH_PARENT,
                    LayoutParams.MATCH_PARENT
                )
                id = View.generateViewId()
            }

            val reactNativeFragment = ReactFragment.Builder()
                .setComponentName(componentName)
                .setLaunchOptions(launchOptions)
                .setFabricEnabled(fabricEnabled)
                .build()

            fragmentActivity.supportFragmentManager
                .beginTransaction()
                .add(view.id, reactNativeFragment)
                .commit()

            view
        },
        modifier = modifier,
        update = {},
    )
}
```
12. Go to `app/src/main/java/com/brownfield/project/MainActivity.kt` and connect new classes with existing UI
```
// app/src/main/java/com/brownfield/project/MainActivity.kt
package com.brownfield.project

import android.content.Intent
import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.core.os.bundleOf
import com.brownfield.project.ui.theme.BrownfieldProjectTheme
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler

class MainActivity : AppCompatActivity(), DefaultHardwareBackBtnHandler {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            BrownfieldProjectTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Column(
                        modifier = Modifier
                            .padding(innerPadding)
                            .verticalScroll(
                                rememberScrollState()
                            )
                    ) {
                        Greeting(
                            name = "Android"
                        )
                        Button(onClick = {
                            val intent = Intent(this@MainActivity, MyReactActivity::class.java)

                            startActivity(intent)
                        }) {
                            Text("Open React")
                        }
                        MyReactNativeComposable(
                            componentName = "MyBrownfieldWidget",
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(400.dp),
                            launchOptions = bundleOf().apply {
                                putString("backgroundColor", "lightgreen")
                                putString("label", "Widget one")
                                putString("src", "https://picsum.photos/id/366/400/300")
                            }
                        )
                        MyReactNativeComposable(
                            componentName = "MyBrownfieldWidget",
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(400.dp),
                            launchOptions = bundleOf().apply {
                                putString("backgroundColor", "orange")
                                putString("label", "Widget two")
                                putString("src", "https://picsum.photos/id/487/400/300")
                            }
                        )
                        MyReactNativeComposable(
                            componentName = "MyBrownfieldWidget",
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(400.dp),
                        )
                    }
                }
            }
        }
    }

    override fun invokeDefaultOnBackPressed() {
        onBackPressedDispatcher.onBackPressed()
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}
```
13. Make Android `Application` instance to confirm to `ReactApplication`
```
// `app/src/main/java/com/brownfield/project/MainApplication.kt`
package com.brownfield.project

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader

class MainApplication: Application(), ReactApplication {
    override val reactNativeHost: ReactNativeHost
        get() = object : DefaultReactNativeHost(this) {
            override fun getPackages(): MutableList<ReactPackage> {
                return PackageList(this).packages
            }

            override fun getJSMainModuleName(): String {
                return "index"
            }

            override fun getUseDeveloperSupport(): Boolean {
                return BuildConfig.DEBUG
            }

            override val isNewArchEnabled: Boolean
                get() = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

            override val isHermesEnabled: Boolean
                get() = BuildConfig.IS_HERMES_ENABLED
        }

    override val reactHost: ReactHost
        get() = getDefaultReactHost(applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, OpenSourceMergedSoMapping)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            load()
        }
    }
}
```
14. To use RN, the activities should use AppCompat themes - go to `app/src/main/res/values/themes.xml` and modify `Theme.AppTheme` to use "AppCompat" theme
- e.g. `<style name="Theme.BrownfieldProject" parent="@style/Theme.AppCompat.Light.NoActionBar" />`
15. Go to `app/src/main/AndroidManifest.xml` and add new RN activity (make sure it also uses "AppCompat" theme)
```diff
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:name=".MainApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.BrownfieldProject"
        tools:targetApi="31">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.BrownfieldProject">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
+       <activity
+           android:name=".MyReactActivity"
+           android:label="reactbrownfieldprojecy"
+           android:theme="@style/Theme.BrownfieldProject">
+       </activity>
    </application>

</manifest>
```

## React Navigation setup

1. Follow the "Basic setup"
2. Prepare additional setup for 3p native libraries in `app/build.gradle.kts`
```diff
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    id("com.facebook.react")
}

+val JS_SRC_DIR = "../js"
+project.ext.set("REACT_NATIVE_NODE_MODULES_DIR", file("$JS_SRC_DIR/node_modules/react-native"))
+rootProject.ext.set("minSdk", 28)
+rootProject.ext.set("minSdkVersion", 28)
```
3. Create another custom `ReactActivity`
```
// `./app/src/main/java/com/brownfield/project/MyReactNavigationActivity.kt`
package com.brownfield.project

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MyReactNavigationActivity: ReactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
    }

    override fun getMainComponentName(): String {
        return "TestNavigation"
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
    }
}
```
4. Add new activity in `android/app/src/main/AndroidManifest.xml`
```diff
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:name=".MainApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Brownfieldtest"
        tools:targetApi="31">

+        <activity
+            android:name=".MyReactNavigationActivity"
+            android:label="reactnavigationbrownfieldtest"
+            android:theme="@style/Theme.Brownfieldtest">
+        </activity>
    </application>

</manifest>
```
5. Add code that will navigate to new activity in `MainActivity`
```
Button(onClick = {
    val intent = Intent(this@MainActivity, MyReactNavigationActivity::class.java)

    startActivity(intent)
}) {
    Text("Open React Navigation")
}
```
6. Add react-navigation libraries and dependencies in `package.json` (follow `https://reactnavigation.org/docs/native-stack-navigator`)
7. Add additional configuration for `react-native-reanimated` in `babel.config.js` and `metro.config.js`
8. Do the sample navigation setup:
```
// js/src/TestNavigation/screens/Detail.tsx
import type { StaticScreenProps } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type DetailProps = StaticScreenProps<{ id: string; imageUrl: string; title: string }>;

// Reanimated Shared Transitions are only supported on old arch atm

const Detail = ({ route }: DetailProps) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.main}>
                <Animated.Image
                    sharedTransitionTag={`image-${route.params.id}`}
                    src={route.params.imageUrl}
                    style={styles.image}
                />
                <Text style={styles.title}>{route.params.title}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    image: {
        alignSelf: 'stretch',
        aspectRatio: 1,
    },
    main: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'center',
    },
    safeArea: {
        alignSelf: 'stretch',
        flex: 1,
    },
    title: {
        color: 'purple',
        fontSize: 36,
        padding: 20,
    },
});

export default Detail;
```

```
// js/src/TestNavigation/screens/Initial.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const ITEM_HEIGHT = 200;

type ItemT = {
    id: string;
    imageUrl: string;
    title: string;
};

const DATA = Array
    .from({ length: 60 }, (_, i) => i + 200)
    .map<ItemT>((id) => ({
        id: `${id}`,
        imageUrl: `https://picsum.photos/id/${id}/${ITEM_HEIGHT}/300`,
        title: `Image ${id}`,
    }));

const ITEM_RIPPLE = { color: '#BCBCBCBC', foreground: true };

// Reanimated Shared Transitions are only supported on old arch atm

const Item = ({ id, imageUrl, title }: ItemT) => {
    const navigation = useNavigation();
    const handlePress = useCallback(() => {
        navigation.navigate('Detail', { id, imageUrl, title });
    }, [navigation.navigate]);

    return (
        <Pressable
            android_ripple={ITEM_RIPPLE}
            onPress={handlePress}
            style={styles.item}>
            <Animated.Image
                sharedTransitionTag={`image-${id}`}
                src={imageUrl}
                style={styles.itemImage}
            />
        </Pressable>
    );
};

function getItemLayout(data: ArrayLike<ItemT>, index) {
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
}

function keyExtractor(item: ItemT) {
    return item.id;
}

function renderItem({ item }: ListRenderItemInfo<ItemT>) {
    return <Item id={item.id} imageUrl={item.imageUrl} title={item.title} />
}

const Initial = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={DATA}
                getItemLayout={getItemLayout}
                initialNumToRender={7}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                style={styles.list}
                windowSize={3}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    item: {
        alignItems: 'center',
        alignSelf: 'stretch',
        height: ITEM_HEIGHT,
    },
    itemImage: {
        height: ITEM_HEIGHT,
        width: 300,
    },
    list: {
        alignSelf: 'stretch',
        flex: 1,
    },
    safeArea: {
        alignSelf: 'stretch',
        flex: 1,
    },
});

export default Initial;
```

```
// js/src/TestNavigation/index.tsx
import type { StaticParamList } from '@react-navigation/native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import DetailScreen from './screens/Detail';
import InitialScreen from './screens/Initial';

const RootStack = createNativeStackNavigator({
    screens: {
        Initial: InitialScreen,
        Detail: DetailScreen,
    },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

export default Navigation;
```

```diff
// js/index.js
import { AppRegistry } from 'react-native';

import Test from './src/Test';
import TestEmbedded from './src/TestEmbedded';
+import TestNavigation from './src/TestNavigation';

AppRegistry.registerComponent('Test', () => Test);
AppRegistry.registerComponent('TestEmbedded', () => TestEmbedded);
+AppRegistry.registerComponent('TestNavigation', () => TestNavigation);
```
