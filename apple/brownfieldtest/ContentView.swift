//
//  ContentView.swift
//  brownfieldtest
//
//  Created by Mateusz Medrek on 28/02/2025.
//

import SwiftUI

struct ContentView: View {
    @State var isReactModalPresented = false
    @State var isReactNavigationModalPresented = false

    @Environment(\.dismiss) var dismiss

    var body: some View {
        VStack {
            ScrollView {
                Image(systemName: "globe")
                    .imageScale(.large)
                    .foregroundStyle(.tint)
                Text("Hello, world!")
                Button {
                    isReactModalPresented = true
                } label: {
                    Text("Open React")
                }
                .fullScreenCover(isPresented: $isReactModalPresented) {
                    MyReactNativeFullScreenModal(
                        moduleName: "Test",
                        initialProperties: nil
                    )
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
                Button {
                    isReactNavigationModalPresented = true
                } label: {
                    Text("Open React Navigation")
                }
                .fullScreenCover(isPresented: $isReactNavigationModalPresented) {
                    MyReactNativeFullScreenModal(
                        moduleName: "TestNavigation",
                        initialProperties: nil
                    )
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
                MyReactNativeViewControllerRepresentable(
                    moduleName: "TestEmbedded",
                    initialProperties: [
                        "backgroundColor": "lightgreen",
                        "label": "Widget one",
                        "src": "https://picsum.photos/id/366/400/300"
                    ]
                )
                .frame(maxWidth: .infinity, minHeight: 400, maxHeight: 400)
                ///
                /// App throws [runtime not ready] errors when trying to display more than one react views
                ///
//                MyReactNativeViewControllerRepresentable(
//                    moduleName: "TestEmbedded",
//                    initialProperties: [
//                        "backgroundColor": "orange",
//                        "label": "Widget two",
//                        "src": "https://picsum.photos/id/487/400/300"
//                    ]
//                )
//                .frame(maxWidth: .infinity, minHeight: 400, maxHeight: 400)
//                MyReactNativeViewControllerRepresentable(
//                    moduleName: "TestEmbedded",
//                    initialProperties: nil
//                )
//                .frame(maxWidth: .infinity, minHeight: 400, maxHeight: 400)
            }
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
