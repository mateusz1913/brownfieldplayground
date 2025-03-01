//
//  MyReactNativeViewControllerRepresentable.swift
//  brownfieldtest
//
//  Created by Mateusz Medrek on 01/03/2025.
//

import SwiftUI

struct MyReactNativeViewControllerRepresentable: UIViewControllerRepresentable {
    let moduleName: String
    let initialProperties: [AnyHashable : Any]?

    func makeUIViewController(context: Context) -> MyReactNativeViewController {
        return MyReactNativeViewController(moduleName: moduleName, initialProperties: initialProperties)
    }
    
    func updateUIViewController(_ uiViewController: MyReactNativeViewController, context: Context) {
        //
    }
}
