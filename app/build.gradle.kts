plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    id("com.facebook.react")
}

val JS_SRC_DIR = "../js"
project.ext.set("REACT_NATIVE_NODE_MODULES_DIR", file("$JS_SRC_DIR/node_modules/react-native"))
rootProject.ext.set("REACT_NATIVE_NODE_MODULES_DIR", file("$JS_SRC_DIR/node_modules/react-native"))
rootProject.ext.set("minSdk", 28)
rootProject.ext.set("minSdkVersion", 28)
rootProject.ext.set("compileSdkVersion", 35)
rootProject.ext.set("targetSdkVersion", 35)

android {
    namespace = "dev.mateusz1913.brownfieldtest"
    compileSdk = 35

    defaultConfig {
        applicationId = "dev.mateusz1913.brownfieldtest"
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
            signingConfig = signingConfigs.getByName("debug")
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
    entryFile = file("${JS_SRC_DIR}/index.js")
    jsRootDir = file(JS_SRC_DIR)

    autolinkLibrariesWithApp()
}

tasks.named("clean") {
    delete("${project.projectDir}/.cxx")
}