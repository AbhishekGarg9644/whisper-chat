const fs = require("fs");
const path = require("path");

const patches = [
  {
    file: path.join(
      __dirname,
      "..",
      "node_modules",
      "react-native-worklets",
      "android",
      "CMakeLists.txt"
    ),
    find: "target_link_libraries(worklets log ReactAndroid::jsi fbjni::fbjni)",
    replace: "target_link_libraries(worklets log c++_shared ReactAndroid::jsi fbjni::fbjni)",
  },
  {
    file: path.join(
      __dirname,
      "..",
      "node_modules",
      "react-native-reanimated",
      "android",
      "CMakeLists.txt"
    ),
    find: "target_link_libraries(reanimated log ReactAndroid::jsi fbjni::fbjni android\n                      worklets)",
    replace:
      "target_link_libraries(reanimated log c++_shared ReactAndroid::jsi fbjni::fbjni android\n                      worklets)",
  },
  {
    file: path.join(
      __dirname,
      "..",
      "node_modules",
      "react-native-screens",
      "android",
      "CMakeLists.txt"
    ),
    find: `        target_link_libraries(rnscreens
            ReactAndroid::reactnative
            ReactAndroid::jsi
            fbjni::fbjni
            android
        )`,
    replace: `        target_link_libraries(rnscreens
            ReactAndroid::reactnative
            c++_shared
            ReactAndroid::jsi
            fbjni::fbjni
            android
        )`,
  },
  {
    file: path.join(
      __dirname,
      "..",
      "node_modules",
      "react-native-screens",
      "android",
      "CMakeLists.txt"
    ),
    find: `    target_link_libraries(rnscreens
        ReactAndroid::jsi
        android
    )`,
    replace: `    target_link_libraries(rnscreens
        c++_shared
        ReactAndroid::jsi
        android
    )`,
  },
  {
    file: path.join(
      __dirname,
      "..",
      "node_modules",
      "react-native-gesture-handler",
      "android",
      "src",
      "main",
      "jni",
      "CMakeLists.txt"
    ),
    find: `target_link_libraries(
  \${PACKAGE_NAME}
  ReactAndroid::reactnative
  ReactAndroid::jsi
  fbjni::fbjni
)`,
    replace: `target_link_libraries(
  \${PACKAGE_NAME}
  c++_shared
  ReactAndroid::reactnative
  ReactAndroid::jsi
  fbjni::fbjni
)`,
  },
  {
    file: path.join(
      __dirname,
      "..",
      "node_modules",
      "expo-modules-core",
      "android",
      "CMakeLists.txt"
    ),
    find: `target_link_libraries(
  \${PACKAGE_NAME}
  CommonSettings
  \${LOG_LIB}
  fbjni::fbjni`,
    replace: `target_link_libraries(
  \${PACKAGE_NAME}
  CommonSettings
  \${LOG_LIB}
  c++_shared
  fbjni::fbjni`,
  },
  {
    file: path.join(
      __dirname,
      "..",
      "node_modules",
      "react-native",
      "ReactAndroid",
      "cmake-utils",
      "ReactNative-application.cmake"
    ),
    find: `target_link_libraries(\${CMAKE_PROJECT_NAME}
        fbjni                               # via 3rd party prefab
        jsi                                 # prefab ready
        reactnative                         # prefab ready
)`,
    replace: `target_link_libraries(\${CMAKE_PROJECT_NAME}
        c++_shared
        fbjni                               # via 3rd party prefab
        jsi                                 # prefab ready
        reactnative                         # prefab ready
)`,
  },
  {
    file: path.join(
      __dirname,
      "..",
      "node_modules",
      "react-native",
      "ReactAndroid",
      "cmake-utils",
      "ReactNative-application.cmake"
    ),
    find: "            target_link_libraries(${autolinked_library} common_flags)",
    replace: `            if(TARGET \${autolinked_library})
                target_link_libraries(\${autolinked_library} c++_shared common_flags)
            endif()`,
  },
];

for (const patch of patches) {
  if (!fs.existsSync(patch.file)) {
    continue;
  }

  const contents = fs.readFileSync(patch.file, "utf8");
  if (contents.includes(patch.replace)) {
    continue;
  }

  if (!contents.includes(patch.find)) {
    throw new Error(`Expected snippet not found in ${patch.file}`);
  }

  fs.writeFileSync(patch.file, contents.replace(patch.find, patch.replace));
  console.log(`Patched ${path.relative(process.cwd(), patch.file)}`);
}
