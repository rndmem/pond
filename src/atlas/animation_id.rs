use std::fmt;
use std::fmt::{Display, Formatter};
use strum_macros::EnumIter;

/// The Atlas Animation identifier for all Animations in the Atlas. IDs are used
/// to reference immutable image source properties, such as dimensions and
/// animation duration, from the Atlas. The tag convention used here is
/// <file stem>-<state or variant or ancillary image>.
#[derive(Debug, PartialEq, Eq, Hash, EnumIter)]
pub enum AnimationID {
  AppleTree,
  AppleTreeShadow,
  ArrowDiagonal,
  ArrowHorizontal,
  ArrowVertical,
  BackpackerIdleDown,
  BackpackerIdleLeft,
  BackpackerIdleRight,
  BackpackerIdleUp,
  BackpackerMeleeRight,
  BackpackerWalkDown,
  BackpackerWalkHorizontalShadow,
  BackpackerWalkLeft,
  BackpackerWalkRight,
  BackpackerWalkUp,
  BackpackerWalkVerticalShadow,
  Bee,
  BeeBlood,
  BeeDead,
  BeeShadow,
  BirdFly,
  BirdRest,
  BirdRise,
  BunnyBlood,
  Bunny,
  BunnyDead,
  BunnyShadow,
  Bush,
  BushShadow,
  Cattails,
  CloudLarge,
  CloudLargeShadow,
  CloudMedium,
  CloudMediumShadow,
  CloudRain,
  CloudRainPuddle,
  CloudRainSplash,
  CloudRainSprinkle,
  Clover0x0,
  Clover0x1,
  Clover0x2,
  Clover0x3,
  Clover0x4,
  Clover1x0,
  Clover1x1,
  Clover1x2,
  Clover1x3,
  Clover1x4,
  Conifer,
  ConiferShadow,
  EggCompartmentDrawer,
  EggCompartmentUnit,
  EggCompartmentUnitPressed,
  Flag,
  FlagShadow,
  Flower,
  FlowerShadow,
  FrogEat,
  FrogIdle,
  FrogIdleShadow,
  FrogLeap,
  Grass00,
  Grass01,
  Grass02,
  Grass03,
  Grass04,
  Grass05,
  Grass06,
  Grass07,
  Grass08,
  Grass09,
  Grass10,
  Grass11,
  Grass12,
  Grass13,
  Grass14,
  Grass15,
  GrassShadow,
  HealthBauble,
  ItemApple,
  ItemAppleShadow,
  Lattice,
  LifeCounter,
  MeleeButtonDisabled,
  MeleeButtonEnabled,
  MemFont000,
  MemFont001,
  MemFont002,
  MemFont003,
  MemFont004,
  MemFont005,
  MemFont006,
  MemFont007,
  MemFont008,
  MemFont009,
  MemFont010,
  MemFont011,
  MemFont012,
  MemFont013,
  MemFont014,
  MemFont015,
  MemFont016,
  MemFont017,
  MemFont018,
  MemFont019,
  MemFont020,
  MemFont021,
  MemFont022,
  MemFont023,
  MemFont024,
  MemFont025,
  MemFont026,
  MemFont027,
  MemFont028,
  MemFont029,
  MemFont030,
  MemFont031,
  MemFont032,
  MemFont033,
  MemFont034,
  MemFont035,
  MemFont036,
  MemFont037,
  MemFont038,
  MemFont039,
  MemFont040,
  MemFont041,
  MemFont042,
  MemFont043,
  MemFont044,
  MemFont045,
  MemFont046,
  MemFont047,
  MemFont048,
  MemFont049,
  MemFont050,
  MemFont051,
  MemFont052,
  MemFont053,
  MemFont054,
  MemFont055,
  MemFont056,
  MemFont057,
  MemFont058,
  MemFont059,
  MemFont060,
  MemFont061,
  MemFont062,
  MemFont063,
  MemFont064,
  MemFont065,
  MemFont066,
  MemFont067,
  MemFont068,
  MemFont069,
  MemFont070,
  MemFont071,
  MemFont072,
  MemFont073,
  MemFont074,
  MemFont075,
  MemFont076,
  MemFont077,
  MemFont078,
  MemFont079,
  MemFont080,
  MemFont081,
  MemFont082,
  MemFont083,
  MemFont084,
  MemFont085,
  MemFont086,
  MemFont087,
  MemFont088,
  MemFont089,
  MemFont090,
  MemFont091,
  MemFont092,
  MemFont093,
  MemFont094,
  MemFont095,
  MemFont096,
  MemFont097,
  MemFont098,
  MemFont099,
  MemFont100,
  MemFont101,
  MemFont102,
  MemFont103,
  MemFont104,
  MemFont105,
  MemFont106,
  MemFont107,
  MemFont108,
  MemFont109,
  MemFont110,
  MemFont111,
  MemFont112,
  MemFont113,
  MemFont114,
  MemFont115,
  MemFont116,
  MemFont117,
  MemFont118,
  MemFont119,
  MemFont120,
  MemFont121,
  MemFont122,
  MemFont123,
  MemFont124,
  MemFont125,
  MemFont126,
  MemFont127,
  MonumentMedium,
  MonumentMediumShadow,
  MonumentSmall,
  MonumentSmallShadow,
  Moon,
  Mountain,
  MountainShadow,
  Oddoid,
  PaletteBlack,
  PaletteBlue,
  PaletteDarkGreen,
  PaletteDarkRed,
  PaletteGreen,
  PaletteGrey,
  PaletteLightBlue,
  PaletteLightGreen,
  PaletteLightGrey,
  PaletteOrange,
  PalettePaleGreen,
  PaletteRed,
  PaletteTransparent,
  PaletteWhite,
  PathCornerE,
  PathCornerN,
  PathNe,
  Pig,
  PigShadow,
  PlayerStatusIdle,
  PlayerStatusWalk,
  Pond,
  RoseBauble,
  SnakeShadow,
  Snake,
  SubshrubShadow,
  Subshrub,
  TreeLargeBare,
  TreeLargeShadow,
  TreeLarge,
  TreeSmallShadow,
  TreeSmall,
  UiButtonBase,
  UiButtonCreate,
  UiButtonDecrement,
  UiButtonDestroy,
  UiButtonIncrement,
  UiButtonMenu,
  UiButtonPressed,
  UiButtonToggleGrid,
  UiCheckerboardBlackTransparent,
  UiCheckerboardBlackWhite,
  UiCheckerboardBlueGrey,
  UiCursorHandPick,
  UiCursorHandPoint,
  UiCursorReticle,
  UiDestinationMarker,
  UiGrid,
  UiSwitch,
  UiWindowModeChart,
  UiZoomMultiplierChart,
  Water,
  Wave,
}

impl Display for AnimationID {
  fn fmt(&self, formatter: &mut Formatter) -> fmt::Result {
    write!(formatter, "{:?}", self)
  }
}

// todo: is this direction needed?
impl AnimationID {
  pub fn value(&self) -> &str {
    match self {
      Self::AppleTree => "appleTree",
      Self::AppleTreeShadow => "appleTree-shadow",
      Self::ArrowDiagonal => "arrow-upRight",
      Self::ArrowHorizontal => "arrow-right",
      Self::ArrowVertical => "arrow-up",
      Self::BackpackerIdleDown => "backpacker-idleDown",
      Self::BackpackerIdleLeft => "backpacker-idleLeft",
      Self::BackpackerIdleRight => "backpacker-idleRight",
      Self::BackpackerIdleUp => "backpacker-idleUp",
      Self::BackpackerMeleeRight => "backpacker-meleeRight",
      Self::BackpackerWalkDown => "backpacker-walkDown",
      Self::BackpackerWalkHorizontalShadow => "backpacker-walkHorizontalShadow",
      Self::BackpackerWalkLeft => "backpacker-walkLeft",
      Self::BackpackerWalkRight => "backpacker-walkRight",
      Self::BackpackerWalkUp => "backpacker-walkUp",
      Self::BackpackerWalkVerticalShadow => "backpacker-walkVerticalShadow",
      Self::Bee => "bee",
      Self::BeeBlood => "bee-blood",
      Self::BeeDead => "bee-dead",
      Self::BeeShadow => "bee-shadow",
      Self::BirdFly => "bird-fly",
      Self::BirdRest => "bird-rest",
      Self::BirdRise => "bird-rise",
      Self::BunnyBlood => "bunny-blood",
      Self::Bunny => "bunny",
      Self::BunnyDead => "bunny-dead",
      Self::BunnyShadow => "bunny-shadow",
      Self::Bush => "bush",
      Self::BushShadow => "bush-shadow",
      Self::Cattails => "cattails",
      Self::CloudLarge => "cloud-large",
      Self::CloudLargeShadow => "cloud-largeShadow",
      Self::CloudMedium => "cloud-medium",
      Self::CloudMediumShadow => "cloud-mediumShadow",
      Self::CloudRain => "cloudRain",
      Self::CloudRainPuddle => "cloudRain-puddle",
      Self::CloudRainSplash => "cloudRainSplash",
      Self::CloudRainSprinkle => "cloudRain-sprinkle",
      Self::Clover0x0 => "clover-0x0",
      Self::Clover0x1 => "clover-0x1",
      Self::Clover0x2 => "clover-0x2",
      Self::Clover0x3 => "clover-0x3",
      Self::Clover0x4 => "clover-0x4",
      Self::Clover1x0 => "clover-1x0",
      Self::Clover1x1 => "clover-1x1",
      Self::Clover1x2 => "clover-1x2",
      Self::Clover1x3 => "clover-1x3",
      Self::Clover1x4 => "clover-1x4",
      Self::Conifer => "conifer",
      Self::ConiferShadow => "conifer-shadow",
      Self::EggCompartmentDrawer => "egg-compartment-drawer",
      Self::EggCompartmentUnit => "egg-compartment-unit",
      Self::EggCompartmentUnitPressed => "eggCompartment-unitPressed",
      Self::Flag => "flag",
      Self::FlagShadow => "flag-shadow",
      Self::Flower => "flower",
      Self::FlowerShadow => "flower-shadow",
      Self::FrogEat => "frog-eat",
      Self::FrogIdle => "frog-idle",
      Self::FrogIdleShadow => "frog-idleShadow",
      Self::FrogLeap => "frog-leap",
      Self::Grass00 => "grass-00",
      Self::Grass01 => "grass-01",
      Self::Grass02 => "grass-02",
      Self::Grass03 => "grass-03",
      Self::Grass04 => "grass-04",
      Self::Grass05 => "grass-05",
      Self::Grass06 => "grass-06",
      Self::Grass07 => "grass-07",
      Self::Grass08 => "grass-08",
      Self::Grass09 => "grass-09",
      Self::Grass10 => "grass-10",
      Self::Grass11 => "grass-11",
      Self::Grass12 => "grass-12",
      Self::Grass13 => "grass-13",
      Self::Grass14 => "grass-14",
      Self::Grass15 => "grass-15",
      Self::GrassShadow => "grass-shadow",
      Self::HealthBauble => "healthBauble",
      Self::ItemApple => "itemApple",
      Self::ItemAppleShadow => "itemApple-shadow",
      Self::Lattice => "lattice",
      Self::LifeCounter => "lifeCounter",
      Self::MeleeButtonDisabled => "meleeButton-disabled",
      Self::MeleeButtonEnabled => "meleeButton-enabled",
      Self::MemFont000 => "memFont-000",
      Self::MemFont001 => "memFont-001",
      Self::MemFont002 => "memFont-002",
      Self::MemFont003 => "memFont-003",
      Self::MemFont004 => "memFont-004",
      Self::MemFont005 => "memFont-005",
      Self::MemFont006 => "memFont-006",
      Self::MemFont007 => "memFont-007",
      Self::MemFont008 => "memFont-008",
      Self::MemFont009 => "memFont-009",
      Self::MemFont010 => "memFont-010",
      Self::MemFont011 => "memFont-011",
      Self::MemFont012 => "memFont-012",
      Self::MemFont013 => "memFont-013",
      Self::MemFont014 => "memFont-014",
      Self::MemFont015 => "memFont-015",
      Self::MemFont016 => "memFont-016",
      Self::MemFont017 => "memFont-017",
      Self::MemFont018 => "memFont-018",
      Self::MemFont019 => "memFont-019",
      Self::MemFont020 => "memFont-020",
      Self::MemFont021 => "memFont-021",
      Self::MemFont022 => "memFont-022",
      Self::MemFont023 => "memFont-023",
      Self::MemFont024 => "memFont-024",
      Self::MemFont025 => "memFont-025",
      Self::MemFont026 => "memFont-026",
      Self::MemFont027 => "memFont-027",
      Self::MemFont028 => "memFont-028",
      Self::MemFont029 => "memFont-029",
      Self::MemFont030 => "memFont-030",
      Self::MemFont031 => "memFont-031",
      Self::MemFont032 => "memFont-032",
      Self::MemFont033 => "memFont-033",
      Self::MemFont034 => "memFont-034",
      Self::MemFont035 => "memFont-035",
      Self::MemFont036 => "memFont-036",
      Self::MemFont037 => "memFont-037",
      Self::MemFont038 => "memFont-038",
      Self::MemFont039 => "memFont-039",
      Self::MemFont040 => "memFont-040",
      Self::MemFont041 => "memFont-041",
      Self::MemFont042 => "memFont-042",
      Self::MemFont043 => "memFont-043",
      Self::MemFont044 => "memFont-044",
      Self::MemFont045 => "memFont-045",
      Self::MemFont046 => "memFont-046",
      Self::MemFont047 => "memFont-047",
      Self::MemFont048 => "memFont-048",
      Self::MemFont049 => "memFont-049",
      Self::MemFont050 => "memFont-050",
      Self::MemFont051 => "memFont-051",
      Self::MemFont052 => "memFont-052",
      Self::MemFont053 => "memFont-053",
      Self::MemFont054 => "memFont-054",
      Self::MemFont055 => "memFont-055",
      Self::MemFont056 => "memFont-056",
      Self::MemFont057 => "memFont-057",
      Self::MemFont058 => "memFont-058",
      Self::MemFont059 => "memFont-059",
      Self::MemFont060 => "memFont-060",
      Self::MemFont061 => "memFont-061",
      Self::MemFont062 => "memFont-062",
      Self::MemFont063 => "memFont-063",
      Self::MemFont064 => "memFont-064",
      Self::MemFont065 => "memFont-065",
      Self::MemFont066 => "memFont-066",
      Self::MemFont067 => "memFont-067",
      Self::MemFont068 => "memFont-068",
      Self::MemFont069 => "memFont-069",
      Self::MemFont070 => "memFont-070",
      Self::MemFont071 => "memFont-071",
      Self::MemFont072 => "memFont-072",
      Self::MemFont073 => "memFont-073",
      Self::MemFont074 => "memFont-074",
      Self::MemFont075 => "memFont-075",
      Self::MemFont076 => "memFont-076",
      Self::MemFont077 => "memFont-077",
      Self::MemFont078 => "memFont-078",
      Self::MemFont079 => "memFont-079",
      Self::MemFont080 => "memFont-080",
      Self::MemFont081 => "memFont-081",
      Self::MemFont082 => "memFont-082",
      Self::MemFont083 => "memFont-083",
      Self::MemFont084 => "memFont-084",
      Self::MemFont085 => "memFont-085",
      Self::MemFont086 => "memFont-086",
      Self::MemFont087 => "memFont-087",
      Self::MemFont088 => "memFont-088",
      Self::MemFont089 => "memFont-089",
      Self::MemFont090 => "memFont-090",
      Self::MemFont091 => "memFont-091",
      Self::MemFont092 => "memFont-092",
      Self::MemFont093 => "memFont-093",
      Self::MemFont094 => "memFont-094",
      Self::MemFont095 => "memFont-095",
      Self::MemFont096 => "memFont-096",
      Self::MemFont097 => "memFont-097",
      Self::MemFont098 => "memFont-098",
      Self::MemFont099 => "memFont-099",
      Self::MemFont100 => "memFont-100",
      Self::MemFont101 => "memFont-101",
      Self::MemFont102 => "memFont-102",
      Self::MemFont103 => "memFont-103",
      Self::MemFont104 => "memFont-104",
      Self::MemFont105 => "memFont-105",
      Self::MemFont106 => "memFont-106",
      Self::MemFont107 => "memFont-107",
      Self::MemFont108 => "memFont-108",
      Self::MemFont109 => "memFont-109",
      Self::MemFont110 => "memFont-110",
      Self::MemFont111 => "memFont-111",
      Self::MemFont112 => "memFont-112",
      Self::MemFont113 => "memFont-113",
      Self::MemFont114 => "memFont-114",
      Self::MemFont115 => "memFont-115",
      Self::MemFont116 => "memFont-116",
      Self::MemFont117 => "memFont-117",
      Self::MemFont118 => "memFont-118",
      Self::MemFont119 => "memFont-119",
      Self::MemFont120 => "memFont-120",
      Self::MemFont121 => "memFont-121",
      Self::MemFont122 => "memFont-122",
      Self::MemFont123 => "memFont-123",
      Self::MemFont124 => "memFont-124",
      Self::MemFont125 => "memFont-125",
      Self::MemFont126 => "memFont-126",
      Self::MemFont127 => "memFont-127",
      Self::MonumentMedium => "monument-medium",
      Self::MonumentMediumShadow => "monument-mediumShadow",
      Self::MonumentSmall => "monument-small",
      Self::MonumentSmallShadow => "monument-smallShadow",
      Self::Moon => "moon",
      Self::Mountain => "mountain",
      Self::MountainShadow => "mountain-shadow",
      Self::Oddoid => "oddoid",
      Self::PaletteBlack => "palette-black",
      Self::PaletteBlue => "palette-blue",
      Self::PaletteDarkGreen => "palette-darkGreen",
      Self::PaletteDarkRed => "palette-darkRed",
      Self::PaletteGreen => "palette-green",
      Self::PaletteGrey => "palette-grey",
      Self::PaletteLightBlue => "palette-lightBlue",
      Self::PaletteLightGreen => "palette-lightGreen",
      Self::PaletteLightGrey => "palette-lightGrey",
      Self::PaletteOrange => "palette-orange",
      Self::PalettePaleGreen => "palette-paleGreen",
      Self::PaletteRed => "palette-red",
      Self::PaletteTransparent => "palette-transparent",
      Self::PaletteWhite => "palette-white",
      Self::PathCornerE => "path->",
      Self::PathCornerN => "path-^",
      Self::PathNe => "path-/",
      Self::Pig => "pig",
      Self::PigShadow => "pig-shadow",
      Self::PlayerStatusIdle => "backpackerIcon-idle",
      Self::PlayerStatusWalk => "backpackerIcon-walk",
      Self::Pond => "pond",
      Self::RoseBauble => "roseBauble",
      Self::SnakeShadow => "snake-shadow",
      Self::Snake => "snake",
      Self::SubshrubShadow => "subshrub-shadow",
      Self::Subshrub => "subshrub",
      Self::TreeLargeBare => "tree-largeBare",
      Self::TreeLargeShadow => "tree-largeShadow",
      Self::TreeLarge => "tree-large",
      Self::TreeSmallShadow => "tree-smallShadow",
      Self::TreeSmall => "tree-small",
      Self::UiButtonBase => "uiButton-base",
      Self::UiButtonCreate => "uiButton-create",
      Self::UiButtonDecrement => "uiButton-decrement",
      Self::UiButtonDestroy => "uiButton-destroy",
      Self::UiButtonIncrement => "uiButton-increment",
      Self::UiButtonMenu => "uiButton-menu",
      Self::UiButtonPressed => "uiButton-pressed",
      Self::UiButtonToggleGrid => "uiButton-toggleGrid",
      Self::UiCheckerboardBlackTransparent => "uiCheckerboard-blackTransparent",
      Self::UiCheckerboardBlackWhite => "uiCheckerboard-blackWhite",
      Self::UiCheckerboardBlueGrey => "uiCheckerboard-blueGrey",
      Self::UiCursorHandPick => "uiCursor-hand-pick",
      Self::UiCursorHandPoint => "uiCursor-hand-point",
      Self::UiCursorReticle => "uiReticle",
      Self::UiDestinationMarker => "uiDestinationMarker",
      Self::UiGrid => "uiGrid",
      Self::UiSwitch => "uiSwitch",
      Self::UiWindowModeChart => "uiWindowModeChart",
      Self::UiZoomMultiplierChart => "uiZoomMultiplierChart",
      Self::Water => "water",
      Self::Wave => "wave",
    }
  }
}

pub static MEM_FONT_PREFIX: &str = "memFont-";

#[cfg(test)]
mod test {
  use crate::atlas;

  #[test]
  fn ids_are_coherent() {
    atlas::parse(&include_json!("atlas.json").unwrap()).unwrap();
  }
}