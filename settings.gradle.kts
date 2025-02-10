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

rootProject.name = "brownfieldtest"
include(":app")
