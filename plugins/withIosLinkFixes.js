const { withXcodeProject } = require("expo/config-plugins");

function appendLinkerFlags(buildSettings, extras) {
  let flags = buildSettings.OTHER_LDFLAGS;
  if (!flags) {
    flags = ['"$(inherited)"'];
  } else if (typeof flags === "string") {
    flags = [flags];
  } else {
    flags = [...flags];
  }

  flags = flags.map((flag) =>
    flag === "$(inherited)" ? '"$(inherited)"' : flag,
  );

  for (const extra of extras) {
    if (!flags.includes(extra)) {
      flags.push(extra);
    }
  }

  buildSettings.OTHER_LDFLAGS = flags;
}

/**
 * Xcode 26 / iOS 26 SDK rejects a direct link of private SwiftUICore.
 * The debug dylib is not an allowed client of that TBD; linking SwiftUI
 * (the public umbrella) and disabling the debug dylib avoids that.
 */
function withIosLinkFixes(config) {
  return withXcodeProject(config, (config) => {
    const configurations = config.modResults.pbxXCBuildConfigurationSection();

    for (const key of Object.keys(configurations)) {
      const buildSettings = configurations[key]?.buildSettings;
      if (!buildSettings) {
        continue;
      }

      buildSettings.ENABLE_DEBUG_DYLIB = "NO";
      buildSettings.SWIFT_ENABLE_EXPLICIT_MODULES = "NO";
      buildSettings.CLANG_ENABLE_EXPLICIT_MODULES = "NO";
      appendLinkerFlags(buildSettings, ["-framework", "SwiftUI"]);
    }

    return config;
  });
}

module.exports = withIosLinkFixes;
