//
//  MyReactNativeFullScreenModal.swift
//  brownfieldtest
//
//  Created by Mateusz Medrek on 01/03/2025.
//

import SwiftUI

struct MyReactNativeFullScreenModal: View {
    @Environment(\.dismiss) var dismiss
    
    let moduleName: String
    let initialProperties: [AnyHashable : Any]?

    var body: some View {
        VStack {
            Button {
                dismiss()
            } label: {
                Image(systemName: "xmark.circle.fill")
            }
            MyReactNativeViewControllerRepresentable(
                moduleName: moduleName,
                initialProperties: initialProperties
            )
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
}
