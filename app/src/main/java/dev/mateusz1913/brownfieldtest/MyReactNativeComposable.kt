package dev.mateusz1913.brownfieldtest

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
