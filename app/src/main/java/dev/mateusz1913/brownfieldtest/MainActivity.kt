package dev.mateusz1913.brownfieldtest

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
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.os.bundleOf
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler
import dev.mateusz1913.brownfieldtest.ui.theme.BrownfieldtestTheme

class MainActivity : AppCompatActivity(), DefaultHardwareBackBtnHandler {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            BrownfieldtestTheme {
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
                        Button(onClick = {
                            val intent = Intent(this@MainActivity, MyReactNavigationActivity::class.java)

                            startActivity(intent)
                        }) {
                            Text("Open React Navigation")
                        }
                        MyReactNativeComposable(
                            componentName = "TestEmbedded",
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
                            componentName = "TestEmbedded",
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
                            componentName = "TestEmbedded",
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

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    BrownfieldtestTheme {
        Greeting("Android")
    }
}