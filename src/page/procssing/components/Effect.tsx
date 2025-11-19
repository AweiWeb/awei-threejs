import DruckEffect from '../EffectShader/Effect';
const Drunk = (props: any) => {
  const effect = new DruckEffect(props);

  return <primitive object={effect} />;
};

export default Drunk;
